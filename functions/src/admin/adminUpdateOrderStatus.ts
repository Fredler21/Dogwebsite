import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db, assertAdmin } from '../lib/admin';
import { isEnum, isNonEmptyString } from '../lib/validation';

const FULFILLMENT = ['unfulfilled','supplier_pending','supplier_ordered','shipped','delivered','canceled'] as const;

export const adminUpdateOrderStatus = onCall(async (req: CallableRequest) => {
  assertAdmin(req);
  const { orderId, fulfillmentStatus, trackingNumber, trackingCarrier, adminNotes } =
    (req.data ?? {}) as Record<string, unknown>;

  if (!isNonEmptyString(orderId)) throw new HttpsError('invalid-argument', 'orderId required');
  if (fulfillmentStatus !== undefined && !isEnum(fulfillmentStatus, FULFILLMENT)) {
    throw new HttpsError('invalid-argument', 'Invalid fulfillmentStatus');
  }

  const update: Record<string, unknown> = { updatedAt: Date.now() };
  if (fulfillmentStatus) update.fulfillmentStatus = fulfillmentStatus;
  if (typeof trackingNumber === 'string') update.trackingNumber = trackingNumber;
  if (typeof trackingCarrier === 'string') update.trackingCarrier = trackingCarrier;
  if (typeof adminNotes === 'string') update.adminNotes = adminNotes;

  await db.collection('orders').doc(orderId).update(update);
  // TODO V9: write to /auditLogs.
  return { ok: true };
});
