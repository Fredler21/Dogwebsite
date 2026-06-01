import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../lib/admin';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Identify carts that have sat unconverted for 24-72h and have an email,
 * enqueue them into /emailQueue for the V5 sender. We don't trigger > once per cart.
 */
export const checkAbandonedCarts = onSchedule('every 6 hours', async () => {
  const now = Date.now();
  const start = now - 72 * HOUR_MS;
  const end = now - 24 * HOUR_MS;

  const snap = await db.collection('carts')
    .where('updatedAt', '>=', start)
    .where('updatedAt', '<=', end)
    .where('checkedOut', '==', false)
    .where('abandonedEmailSent', '!=', true)
    .limit(500)
    .get();

  if (snap.empty) return;
  const batch = db.batch();
  for (const doc of snap.docs) {
    const c = doc.data();
    if (!c.customerEmail || !(c.items?.length > 0)) continue;
    batch.set(db.collection('emailQueue').doc(), {
      to: c.customerEmail,
      templateName: 'abandonedCart',
      data: { itemCount: c.items.length, resumeUrl: `${process.env.SITE_URL ?? ''}/cart?resume=${doc.id}` },
      relatedRef: { collection: 'carts', id: doc.id },
      createdAt: now
    });
    batch.update(doc.ref, { abandonedEmailSent: true, abandonedEmailAt: now });
  }
  await batch.commit();
});

/** Find orders stuck in pending/processing for too long and create AI alerts. */
export const checkDelayedOrders = onSchedule('every 12 hours', async () => {
  const cutoff = Date.now() - 5 * DAY_MS;
  const snap = await db.collection('orders')
    .where('paymentStatus', '==', 'paid')
    .where('fulfillmentStatus', 'in', ['pending', 'processing'])
    .where('createdAt', '<=', cutoff)
    .limit(200).get();
  if (snap.empty) return;
  const batch = db.batch();
  for (const doc of snap.docs) {
    const o = doc.data();
    const ageDays = Math.floor((Date.now() - (o.createdAt ?? Date.now())) / DAY_MS);
    batch.set(db.collection('aiAlerts').doc(), {
      type: 'order_monitor', severity: ageDays >= 10 ? 'critical' : 'warning',
      orderId: doc.id, reason: `Order ${o.orderNumber} unshipped after ${ageDays}d`,
      suggestedAction: 'Contact supplier and/or apology email',
      resolved: false, createdAt: Date.now()
    });
  }
  await batch.commit();
});

/** Queue review-request emails for orders delivered 7-9 days ago. */
export const sendReviewRequests = onSchedule({ schedule: 'every day 10:00', timeZone: 'America/Toronto' }, async () => {
  const now = Date.now();
  const start = now - 9 * DAY_MS;
  const end = now - 7 * DAY_MS;
  const snap = await db.collection('orders')
    .where('fulfillmentStatus', '==', 'delivered')
    .where('deliveredAt', '>=', start)
    .where('deliveredAt', '<=', end)
    .where('reviewRequestSent', '!=', true)
    .limit(500).get();
  if (snap.empty) return;
  const batch = db.batch();
  for (const doc of snap.docs) {
    const o = doc.data();
    if (!o.customerEmail) continue;
    batch.set(db.collection('emailQueue').doc(), {
      to: o.customerEmail, templateName: 'reviewRequest',
      data: { orderNumber: o.orderNumber, reviewUrl: `${process.env.SITE_URL ?? ''}/orders/${doc.id}/review` },
      relatedRef: { collection: 'orders', id: doc.id }, createdAt: now
    });
    batch.update(doc.ref, { reviewRequestSent: true });
  }
  await batch.commit();
});

/** Flag products whose inventoryCount is at or below their lowStockThreshold. */
export const lowStockAlerts = onSchedule('every 6 hours', async () => {
  const snap = await db.collection('products')
    .where('active', '==', true)
    .where('trackInventory', '==', true)
    .limit(1000).get();
  const low = snap.docs.filter(d => {
    const p = d.data();
    return typeof p.inventoryCount === 'number'
      && typeof p.lowStockThreshold === 'number'
      && p.inventoryCount <= p.lowStockThreshold;
  });
  if (low.length === 0) return;
  const batch = db.batch();
  for (const doc of low) {
    batch.set(db.collection('aiAlerts').doc(), {
      type: 'low_stock', severity: 'warning',
      productId: doc.id,
      reason: `${doc.data().title} at ${doc.data().inventoryCount} units (threshold ${doc.data().lowStockThreshold})`,
      suggestedAction: 'Reorder from supplier or hide from storefront',
      resolved: false, createdAt: Date.now()
    });
  }
  await batch.commit();
});

/** Nudge supplier when a /supplierOrders row has sat in awaiting/sourced for 3+ days. */
export const nudgeStuckSupplierOrders = onSchedule('every day 11:00', async () => {
  const cutoff = Date.now() - 3 * DAY_MS;
  const snap = await db.collection('supplierOrders')
    .where('status', 'in', ['awaiting', 'sourced'])
    .where('createdAt', '<=', cutoff)
    .where('nudgedAt', '<=', Date.now() - 2 * DAY_MS) // don't nudge more than every 2d
    .limit(200).get();
  if (snap.empty) return;
  const batch = db.batch();
  for (const doc of snap.docs) {
    const so = doc.data();
    const supplier = await db.collection('suppliers').doc(so.supplierId).get();
    if (!supplier.exists) continue;
    const order = await db.collection('orders').doc(so.orderId).get();
    const days = Math.floor((Date.now() - so.createdAt) / DAY_MS);
    batch.set(db.collection('emailQueue').doc(), {
      to: supplier.data()?.contactEmail,
      templateName: 'supplierReminder',
      data: { orderNumber: order.data()?.orderNumber ?? doc.id, daysOpen: days },
      relatedRef: { collection: 'supplierOrders', id: doc.id }, createdAt: Date.now()
    });
    batch.update(doc.ref, { nudgedAt: Date.now() });
  }
  await batch.commit();
});
