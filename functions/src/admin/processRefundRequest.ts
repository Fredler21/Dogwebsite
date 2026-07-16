import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db, admin, assertAdmin } from '../lib/admin';
import { stripe } from '../lib/stripe';
import { isNonEmptyString } from '../lib/validation';

// Stripe only accepts these three enum values for a refund `reason`. Any
// human-entered reason is preserved in metadata + the audit log instead.
const STRIPE_REFUND_REASONS = new Set(['duplicate', 'fraudulent', 'requested_by_customer']);

/**
 * Issues a Stripe refund for an order, then lets the existing `charge.refunded`
 * webhook update the order doc (paymentStatus / refundedAmount) and the
 * `onOrderRefunded` trigger send the customer email. We deliberately do NOT
 * mutate the order here to avoid racing the webhook.
 *
 * Full refund: omit `amount`. Partial refund: pass `amount` in cents.
 */
export const processRefundRequest = onCall(
  { secrets: ['STRIPE_SECRET_KEY'] },
  async (req: CallableRequest) => {
    assertAdmin(req);
    const { orderId, amount, reason } = (req.data ?? {}) as Record<string, unknown>;
    if (!isNonEmptyString(orderId)) throw new HttpsError('invalid-argument', 'orderId required');

    const snap = await db.collection('orders').doc(orderId).get();
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
    const order = snap.data()!;

    // Allow refunding a fully-paid order or topping up a partial refund.
    if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'partially_refunded') {
      throw new HttpsError('failed-precondition', `Order not refundable (status: ${order.paymentStatus})`);
    }

    const paymentIntentId = order.stripePaymentIntentId as string | undefined;
    if (!isNonEmptyString(paymentIntentId)) {
      throw new HttpsError('failed-precondition', 'Order has no Stripe payment to refund');
    }

    // Refundable ceiling = grand total minus whatever was already refunded.
    const grandTotal = typeof order.grandTotal === 'number' ? order.grandTotal : 0;
    const alreadyRefunded = typeof order.refundedAmount === 'number' ? order.refundedAmount : 0;
    const maxRefundable = grandTotal - alreadyRefunded;
    if (maxRefundable <= 0) {
      throw new HttpsError('failed-precondition', 'Order is already fully refunded');
    }

    // Validate the (optional) partial amount. Omitted => full remaining refund.
    let refundAmount: number | undefined;
    if (amount !== undefined && amount !== null) {
      if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
        throw new HttpsError('invalid-argument', 'amount must be a positive integer (cents)');
      }
      if (amount > maxRefundable) {
        throw new HttpsError('invalid-argument', `amount exceeds refundable balance (${maxRefundable} cents)`);
      }
      refundAmount = amount;
    }

    const humanReason = isNonEmptyString(reason) ? reason : undefined;
    const actor = (req.auth?.token?.email as string | undefined) ?? req.auth?.uid ?? 'admin';

    let refund;
    try {
      refund = await stripe().refunds.create(
        {
          payment_intent: paymentIntentId,
          ...(refundAmount !== undefined ? { amount: refundAmount } : {}),
          ...(humanReason && STRIPE_REFUND_REASONS.has(humanReason)
            ? { reason: humanReason as 'duplicate' | 'fraudulent' | 'requested_by_customer' }
            : {}),
          metadata: { orderId, reason: humanReason ?? '', requestedBy: actor },
        },
        {
          // Guard against accidental double-submit of the same refund. A second
          // deliberate identical partial refund should be issued via Stripe.
          idempotencyKey: `refund_${orderId}_${refundAmount ?? 'full'}`,
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Stripe refund failed';
      throw new HttpsError('internal', `Refund failed: ${msg}`);
    }

    // Audit trail (same collection the webhook uses). The order doc itself is
    // updated by the charge.refunded webhook, which also fires the email.
    await db.collection('auditLogs').add({
      actor,
      action: 'refund.created',
      orderId,
      refundId: refund.id,
      amount: refund.amount,
      reason: humanReason ?? null,
      createdAt: Date.now(),
    });

    return { ok: true, refundId: refund.id, amount: refund.amount, status: refund.status };
  }
);

// Keep firestore admin SDK reference alive for tree-shake safety.
void admin;
