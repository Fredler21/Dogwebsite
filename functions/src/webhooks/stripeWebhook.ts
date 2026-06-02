import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import type { Request, Response } from 'express';
import { admin, db } from '../lib/admin';
import { stripe } from '../lib/stripe';

const WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

type OrderItem = { productId: string; variantId?: string | null; quantity: number; unitPrice: number };
type OrderDoc = {
  paymentStatus: string;
  items?: OrderItem[];
  inventoryReserved?: boolean;
};

/**
 * Atomically marks the order paid AND decrements per-product inventory.
 * Idempotent: if the order is already paid, does nothing.
 * Returns true if this call performed the transition.
 */
async function markPaidAndDecrementStock(
  orderId: string,
  paymentIntentId: string | null,
  discountCode: string | null
): Promise<boolean> {
  return db.runTransaction(async (tx) => {
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return false;
    const order = orderSnap.data() as OrderDoc;
    if (order.paymentStatus !== 'pending') return false; // already handled

    const items = order.items ?? [];
    // Read all product docs first (transactions require reads before writes).
    const productRefs = items.map((it) => db.collection('products').doc(it.productId));
    const productSnaps = await Promise.all(productRefs.map((r) => tx.get(r)));

    // Decrement stock where tracked. We allow stock to go negative rather than
    // fail the payment after Stripe has already charged the customer — the
    // admin gets an alert and can resolve manually. The earlier soft check at
    // checkout-create catches the common case.
    for (let i = 0; i < productSnaps.length; i++) {
      const ps = productSnaps[i];
      if (!ps.exists) continue;
      const p = ps.data() as { trackInventory?: boolean; inventoryCount?: number; lowStockThreshold?: number };
      if (!p.trackInventory) continue;
      const qty = items[i].quantity;
      tx.update(productRefs[i], {
        inventoryCount: admin.firestore.FieldValue.increment(-qty),
        updatedAt: Date.now(),
      });
    }

    tx.update(orderRef, {
      paymentStatus: 'paid',
      stripePaymentIntentId: paymentIntentId,
      inventoryReserved: true,
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });

    if (discountCode) {
      tx.set(
        db.collection('discounts').doc(discountCode.toUpperCase()),
        {
          usedCount: admin.firestore.FieldValue.increment(1),
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    }

    return true;
  });
}

export const stripeWebhook = onRequest(
  { secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    if (typeof sig !== 'string') {
      res.status(400).send('Missing signature');
      return;
    }

    let event;
    try {
      event = stripe().webhooks.constructEvent(
        (req as Request & { rawBody: Buffer }).rawBody,
        sig,
        WEBHOOK_SECRET.value()
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'invalid signature';
      res.status(400).send(`Webhook Error: ${msg}`);
      return;
    }

    // ── Idempotency: refuse to process the same Stripe event twice. ──
    // Stripe will retry on any non-2xx response; if we already handled the
    // event, return 200 immediately.
    const eventRef = db.collection('processedStripeEvents').doc(event.id);
    try {
      await db.runTransaction(async (tx) => {
        const existing = await tx.get(eventRef);
        if (existing.exists) {
          throw new Error('__ALREADY_PROCESSED__');
        }
        tx.set(eventRef, {
          type: event.type,
          createdAt: Date.now(),
          // Stripe retains events ~30 days; we set ttl below.
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        });
      });
    } catch (e) {
      if (e instanceof Error && e.message === '__ALREADY_PROCESSED__') {
        res.json({ received: true, duplicate: true });
        return;
      }
      const msg = e instanceof Error ? e.message : 'idempotency error';
      res.status(500).send(msg);
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const s = event.data.object as {
          id: string;
          metadata?: { orderId?: string; discountCode?: string };
          payment_intent?: string | null;
          customer_details?: { phone?: string | null; address?: unknown; name?: string | null };
          shipping_details?: { address?: unknown; name?: string | null };
        };
        const orderId = s.metadata?.orderId;
        if (orderId) {
          const code = s.metadata?.discountCode || null;
          const pi = typeof s.payment_intent === 'string' ? s.payment_intent : null;
          await markPaidAndDecrementStock(orderId, pi, code);
          // Save shipping address + phone separately so we don't conflict with the txn.
          await db.collection('orders').doc(orderId).update({
            shippingAddress: s.shipping_details?.address ?? null,
            shippingName: s.shipping_details?.name ?? s.customer_details?.name ?? null,
            customerPhone: s.customer_details?.phone ?? null,
            updatedAt: Date.now(),
          });
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object as { id: string; metadata?: { orderId?: string }; last_payment_error?: { message?: string } };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await db.collection('orders').doc(orderId).update({
            paymentStatus: 'failed',
            paymentFailureReason: pi.last_payment_error?.message ?? null,
            updatedAt: Date.now(),
          });
        }
      } else if (event.type === 'charge.refunded') {
        const ch = event.data.object as {
          metadata?: { orderId?: string };
          payment_intent?: string;
          amount_refunded: number;
          amount: number;
        };
        // Refunds may not carry the metadata directly; fall back to PI metadata.
        let orderId = ch.metadata?.orderId;
        if (!orderId && typeof ch.payment_intent === 'string') {
          const piObj = await stripe().paymentIntents.retrieve(ch.payment_intent);
          orderId = (piObj.metadata as { orderId?: string } | undefined)?.orderId;
        }
        if (orderId) {
          const status = ch.amount_refunded >= ch.amount ? 'refunded' : 'partially_refunded';
          await db.collection('orders').doc(orderId).update({
            paymentStatus: status,
            refundedAmount: ch.amount_refunded,
            updatedAt: Date.now(),
          });
        }
      } else if (event.type === 'charge.dispute.created') {
        const dp = event.data.object as { payment_intent?: string; reason?: string; amount?: number };
        if (typeof dp.payment_intent === 'string') {
          const piObj = await stripe().paymentIntents.retrieve(dp.payment_intent);
          const orderId = (piObj.metadata as { orderId?: string } | undefined)?.orderId;
          if (orderId) {
            await db.collection('orders').doc(orderId).update({
              disputeStatus: 'open',
              disputeReason: dp.reason ?? null,
              riskStatus: 'high',
              updatedAt: Date.now(),
            });
            await db.collection('aiAlerts').add({
              type: 'dispute',
              severity: 'high',
              orderId,
              reason: dp.reason ?? 'Stripe dispute opened',
              createdAt: Date.now(),
              status: 'open',
            });
          }
        }
      }

      await db.collection('auditLogs').add({
        actor: 'stripe-webhook',
        action: event.type,
        eventId: event.id,
        createdAt: Date.now(),
      });

      res.json({ received: true });
    } catch (err) {
      // Roll back the idempotency marker so Stripe retries this event.
      await eventRef.delete().catch(() => undefined);
      const msg = err instanceof Error ? err.message : 'handler error';
      res.status(500).send(msg);
    }
  }
);
