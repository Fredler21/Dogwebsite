import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db, assertAdmin } from '../lib/admin';
import { isNonEmptyString } from '../lib/validation';

// V2 stub. V4 calls Stripe.refunds.create; V9 adds audit log + email.
export const processRefundRequest = onCall(async (req: CallableRequest) => {
  assertAdmin(req);
  const { orderId, amount, reason } = (req.data ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(orderId)) throw new HttpsError('invalid-argument', 'orderId required');

  const snap = await db.collection('orders').doc(orderId).get();
  if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
  const order = snap.data()!;
  if (order.paymentStatus !== 'paid') {
    throw new HttpsError('failed-precondition', 'Order not in paid state');
  }
  // TODO V4: Stripe refund. TODO V9: audit + email.
  return { ok: true, todo: 'V4 wires Stripe refund', amount, reason };
});
