import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { db } from '../lib/admin';

/**
 * Fires when a new order document is created (still in `pending` state).
 * - Drops an admin alert so the team sees activity in real time.
 * - Records an audit log entry.
 * Email confirmation is handled in `onOrderPaid` after Stripe confirms payment.
 */
export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data?.data();
  if (!order) return;
  const orderId = event.params.orderId;
  const now = Date.now();

  await Promise.all([
    db.collection('aiAlerts').add({
      type: 'order_created',
      severity: 'low',
      orderId,
      reason: `New ${order.paymentStatus ?? 'pending'} order ${order.orderNumber ?? orderId} for ${order.customerEmail ?? 'unknown'}`,
      grandTotal: order.grandTotal ?? 0,
      createdAt: now,
      status: 'open',
    }),
    db.collection('auditLogs').add({
      actor: 'system',
      action: 'order.created',
      orderId,
      customerEmail: order.customerEmail ?? null,
      grandTotal: order.grandTotal ?? 0,
      createdAt: now,
    }),
  ]);
});
