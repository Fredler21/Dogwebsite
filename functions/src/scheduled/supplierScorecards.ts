import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../lib/admin';

const DAY_MS = 86_400_000;

/**
 * Nightly: roll up supplier performance from /supplierOrders into /suppliers.{onTimeRate, defectRate, avgLeadTimeDays}.
 * Considers the last 90 days. Promised leadtime comes from supplier.defaultLeadTimeDays.
 */
export const computeSupplierScorecards = onSchedule({ schedule: 'every day 03:30', timeZone: 'America/Toronto' }, async () => {
  const cutoff = Date.now() - 90 * DAY_MS;
  const suppliers = await db.collection('suppliers').get();

  for (const sDoc of suppliers.docs) {
    const supplierId = sDoc.id;
    const promised = (sDoc.data().defaultLeadTimeDays as number) ?? 14;
    const orders = await db.collection('supplierOrders')
      .where('supplierId', '==', supplierId)
      .where('createdAt', '>=', cutoff).get();

    if (orders.empty) continue;
    let onTime = 0, total = 0, leadSum = 0, leadCount = 0, issues = 0;
    for (const od of orders.docs) {
      const o = od.data();
      if (o.status === 'delivered') {
        total++;
        const leadDays = ((o.deliveredAt ?? Date.now()) - o.createdAt) / DAY_MS;
        leadSum += leadDays; leadCount++;
        if (leadDays <= promised) onTime++;
      }
      if (o.status === 'issue') issues++;
    }
    const linked = orders.size;
    await sDoc.ref.update({
      onTimeRate: total > 0 ? onTime / total : null,
      defectRate: linked > 0 ? issues / linked : 0,
      avgLeadTimeDays: leadCount > 0 ? leadSum / leadCount : null,
      totalOrdersFulfilled: total,
      scorecardUpdatedAt: Date.now()
    });
  }
});
