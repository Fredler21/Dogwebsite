'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { StatCard } from '@/components/admin/StatCard';

type Order = {
  paymentStatus?: string;
  fulfillmentStatus?: string;
  total?: number;
  createdAt?: number;
  estimatedDelivery?: number;
};
type Ticket = { status?: string; priority?: string };
type Refund = { status?: string };

export default function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const db = fbDb();
        const ordersSnap = await getDocs(
          query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(500))
        );
        setOrders(ordersSnap.docs.map((d) => d.data() as Order));

        try {
          const ticketsSnap = await getDocs(
            query(collection(db, 'supportTickets'), where('status', '!=', 'closed'), limit(200))
          );
          setTickets(ticketsSnap.docs.map((d) => d.data() as Ticket));
        } catch {
          /* collection may not exist yet */
        }

        try {
          const refundsSnap = await getDocs(
            query(collection(db, 'refundRequests'), where('status', '==', 'pending'), limit(200))
          );
          setRefunds(refundsSnap.docs.map((d) => d.data() as Refund));
        } catch {
          /* collection may not exist yet */
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayStart = startOfToday.getTime();

  const todaySales = orders
    .filter((o) => o.paymentStatus === 'paid' && (o.createdAt ?? 0) >= todayStart)
    .reduce((s, o) => s + (o.total ?? 0), 0);

  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending').length;
  const unfulfilled = orders.filter(
    (o) => o.paymentStatus === 'paid' && (o.fulfillmentStatus ?? 'unfulfilled') !== 'fulfilled'
  ).length;
  const now = Date.now();
  const delayed = orders.filter(
    (o) =>
      o.paymentStatus === 'paid' &&
      (o.fulfillmentStatus ?? 'unfulfilled') !== 'fulfilled' &&
      o.estimatedDelivery &&
      o.estimatedDelivery < now
  ).length;

  const openTickets = tickets.length;
  const refundRequests = refunds.length;
  const urgentAlerts = tickets.filter((t) => t.priority === 'urgent').length;

  // Rough profit estimate: 35% margin on paid revenue today until COGS is wired in.
  const estimatedProfit = Math.round(todaySales * 0.35);

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-2 text-sm text-slate-500">Loading live data…</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Today sales"
          value={`$${(todaySales / 100).toFixed(2)}`}
          hint="Paid orders since 00:00"
        />
        <StatCard label="Pending orders" value={String(pendingOrders)} />
        <StatCard label="Unfulfilled" value={String(unfulfilled)} />
        <StatCard label="Delayed" value={String(delayed)} hint="Past estimated delivery" />
        <StatCard label="Open tickets" value={String(openTickets)} />
        <StatCard label="Refund requests" value={String(refundRequests)} />
        <StatCard label="AI urgent alerts" value={String(urgentAlerts)} />
        <StatCard
          label="Estimated profit"
          value={`$${(estimatedProfit / 100).toFixed(2)}`}
          hint="35% margin estimate"
        />
      </div>
    </div>
  );
}
