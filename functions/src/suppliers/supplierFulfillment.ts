import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';

function requireAdmin(req: CallableRequest): void {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
}

const STATUSES = ['awaiting','sourced','shipped','delivered','cancelled','issue'] as const;
type SupplierOrderStatus = typeof STATUSES[number];

/** Assign a paid order to a supplier. Creates a /supplierOrders row + links it on the order. */
export const assignSupplierToOrder = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { orderId, supplierId, costCents, notes } = (req.data ?? {}) as
    { orderId?: string; supplierId?: string; costCents?: number; notes?: string };
  if (!orderId || !supplierId) throw new HttpsError('invalid-argument', 'orderId + supplierId required');
  if (typeof costCents !== 'number' || costCents < 0) throw new HttpsError('invalid-argument', 'costCents required');

  const [order, supplier] = await Promise.all([
    db.collection('orders').doc(orderId).get(),
    db.collection('suppliers').doc(supplierId).get()
  ]);
  if (!order.exists) throw new HttpsError('not-found', 'order not found');
  if (!supplier.exists) throw new HttpsError('not-found', 'supplier not found');
  if (supplier.data()?.active === false) throw new HttpsError('failed-precondition', 'supplier is inactive');

  const now = Date.now();
  const ref = await db.collection('supplierOrders').add({
    orderId, supplierId,
    status: 'awaiting' as SupplierOrderStatus,
    costCents,
    notes: notes ?? null,
    createdAt: now, updatedAt: now
  });
  await db.collection('orders').doc(orderId).update({
    supplierOrderId: ref.id, supplierId, fulfillmentStatus: 'processing', updatedAt: now
  });
  return { ok: true, supplierOrderId: ref.id };
});

/** Update supplier order status. When status becomes 'shipped' we propagate tracking up to the customer order. */
export const updateSupplierOrderStatus = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { supplierOrderId, status, trackingNumber, trackingCarrier, notes } =
    (req.data ?? {}) as { supplierOrderId?: string; status?: string; trackingNumber?: string; trackingCarrier?: string; notes?: string };
  if (!supplierOrderId || !status || !STATUSES.includes(status as SupplierOrderStatus))
    throw new HttpsError('invalid-argument', `status must be one of ${STATUSES.join(',')}`);

  const ref = db.collection('supplierOrders').doc(supplierOrderId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'supplierOrder not found');
  const so = snap.data() as { orderId: string; supplierId: string };

  const now = Date.now();
  const patch: Record<string, unknown> = { status, updatedAt: now };
  if (notes) patch.notes = notes;
  if (status === 'shipped') {
    if (!trackingNumber) throw new HttpsError('invalid-argument', 'trackingNumber required when status=shipped');
    patch.trackingNumber = trackingNumber;
    patch.trackingCarrier = trackingCarrier ?? null;
    patch.shippedAt = now;
  }
  if (status === 'delivered') patch.deliveredAt = now;
  await ref.update(patch);

  // Propagate up to the customer-facing order (triggers V5 email).
  if (status === 'shipped' && trackingNumber) {
    await db.collection('orders').doc(so.orderId).update({
      trackingNumber, trackingCarrier: trackingCarrier ?? null,
      fulfillmentStatus: 'shipped', shippedAt: now, updatedAt: now
    });
  } else if (status === 'delivered') {
    await db.collection('orders').doc(so.orderId).update({
      fulfillmentStatus: 'delivered', deliveredAt: now, updatedAt: now
    });
    // Bump supplier scorecard counter.
    await db.collection('suppliers').doc(so.supplierId).update({
      totalOrdersFulfilled: (await db.collection('suppliers').doc(so.supplierId).get())
        .data()?.totalOrdersFulfilled ?? 0
    });
  } else if (status === 'issue') {
    await db.collection('orders').doc(so.orderId).update({
      fulfillmentStatus: 'issue', updatedAt: now
    });
  }
  return { ok: true };
});
