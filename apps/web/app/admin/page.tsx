'use client';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { StatCard } from '@/components/admin/StatCard';

type Order = {
  paymentStatus?: string;
  fulfillmentStatus?: string;
  grandTotal?: number;
  total?: number;
  createdAt?: number;
  estimatedDelivery?: number;
};
type Ticket = { status?: string; priority?: string };
type Refund = { status?: string };

function toLocalDateInput(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function dayBounds(dateStr: string): { start: number; end: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const start = new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0).getTime();
  const end = new Date(y, (m ?? 1) - 1, d ?? 1, 23, 59, 59, 999).getTime();
  return { start, end };
}

export default function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(toLocalDateInput(Date.now()));

  useEffect(() => {
    (async () => {
      try {
        const db = fbDb();
        const ordersSnap = await getDocs(
          query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(1000))
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

  const { start, end } = useMemo(() => dayBounds(selectedDay), [selectedDay]);
  const isToday = selectedDay === toLocalDateInput(Date.now());

  const dayOrders = orders.filter((o) => (o.createdAt ?? 0) >= start && (o.createdAt ?? 0) <= end);

  const sales = dayOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((s, o) => s + (o.grandTotal ?? o.total ?? 0), 0);
  const pendingOrders = dayOrders.filter((o) => o.paymentStatus === 'pending').length;
  const unfulfilled = dayOrders.filter(
    (o) => o.paymentStatus === 'paid' && (o.fulfillmentStatus ?? 'unfulfilled') !== 'fulfilled'
  ).length;
  const now = Date.now();
  const delayed = dayOrders.filter(
    (o) =>
      o.paymentStatus === 'paid' &&
      (o.fulfillmentStatus ?? 'unfulfilled') !== 'fulfilled' &&
      o.estimatedDelivery &&
      o.estimatedDelivery < now
  ).length;

  const openTickets = tickets.length;
  const refundRequests = refunds.length;
  const urgentAlerts = tickets.filter((t) => t.priority === 'urgent').length;
  const estimatedProfit = Math.round(sales * 0.35);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            Showing {isToday ? 'today' : new Date(start).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="dayPicker" className="text-sm text-slate-600">
            Day:
          </label>
          <input
            id="dayPicker"
            type="date"
            value={selectedDay}
            max={toLocalDateInput(Date.now())}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
          />
          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDay(toLocalDateInput(Date.now()))}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm hover:bg-slate-50"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-2 text-sm text-slate-500">Loading live data…</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label={isToday ? 'Today sales' : 'Sales'}
          value={`$${(sales / 100).toFixed(2)}`}
          hint="Paid orders for selected day"
        />
        <StatCard label="Pending orders" value={String(pendingOrders)} hint="On selected day" />
        <StatCard label="Unfulfilled" value={String(unfulfilled)} hint="On selected day" />
        <StatCard label="Delayed" value={String(delayed)} hint="Past estimated delivery" />
        <StatCard label="Open tickets" value={String(openTickets)} hint="All-time, not closed" />
        <StatCard label="Refund requests" value={String(refundRequests)} hint="Pending" />
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
