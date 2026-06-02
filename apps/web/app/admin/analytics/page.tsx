'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';

function StatCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 truncate text-sm">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded bg-slate-100">
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right text-xs text-slate-600">{value}</span>
    </div>
  );
}

type Order = {
  paymentStatus?: string;
  total?: number;
  createdAt?: number;
  items?: { productId?: string; title?: string; quantity?: number }[];
};

async function fetchOrders(): Promise<Order[]> {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const q = query(
    collection(fbDb(), 'orders'),
    where('paymentStatus', '==', 'paid'),
    orderBy('createdAt', 'desc'),
    limit(500)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order).filter((o) => (o.createdAt ?? 0) >= cutoff);
}

export default function AdminAnalytics() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders().then(setOrders).catch((e) => setError((e as Error).message));
  }, []);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!orders) return <p className="text-sm text-slate-500">Loading…</p>;

  const revenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const orderCount = orders.length;
  const productCounts = new Map<string, number>();
  for (const o of orders) {
    for (const it of o.items ?? []) {
      const key = it.title ?? it.productId ?? '—';
      productCounts.set(key, (productCounts.get(key) ?? 0) + (it.quantity ?? 0));
    }
  }
  const topProducts = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));
  const max = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.value)) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-sm text-slate-600">Live KPIs from paid orders in Firestore.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue (30d)" value={`$${(revenue / 100).toFixed(2)}`} hint="paid orders only" />
        <StatCard title="Orders (30d)" value={String(orderCount)} hint="paid only" />
        <StatCard
          title="Avg order value"
          value={orderCount > 0 ? `$${(revenue / orderCount / 100).toFixed(2)}` : '—'}
        />
        <StatCard
          title="Top SKU sold"
          value={topProducts[0]?.label ?? '—'}
          hint={topProducts[0] ? `${topProducts[0].value} units` : undefined}
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Top products (30d)</h2>
      <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        {topProducts.length === 0 && <p className="text-sm text-slate-500">No paid orders yet.</p>}
        {topProducts.map((p) => (
          <Bar key={p.label} {...p} max={max} />
        ))}
      </div>
    </div>
  );
}
