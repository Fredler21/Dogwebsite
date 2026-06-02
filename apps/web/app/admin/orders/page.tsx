'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

type OrderRow = {
  id: string;
  orderNumber?: string;
  customerEmail?: string;
  grandTotal?: number;
  total?: number;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt?: number;
};

const fmt = (c: number | undefined) => (typeof c === 'number' ? `$${(c / 100).toFixed(2)}` : '—');
const ago = (t: number | undefined) => {
  if (!t) return '—';
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

export default function OrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(fbDb(), 'orders'), orderBy('createdAt', 'desc'), limit(100));
        const snap = await getDocs(q);
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderRow, 'id'>) })));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="mt-6">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <DataTable
            rows={rows}
            columns={[
              {
                key: 'num',
                label: 'Order',
                render: (r) => (
                  <Link className="text-brand-accent underline" href={`/admin/orders/${r.id}`}>
                    {r.orderNumber ?? r.id.slice(0, 8)}
                  </Link>
                ),
              },
              { key: 'email', label: 'Customer', render: (r) => r.customerEmail ?? '—' },
              { key: 'total', label: 'Total', render: (r) => fmt(r.grandTotal ?? r.total) },
              { key: 'pay', label: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus ?? 'pending'} /> },
              { key: 'ful', label: 'Fulfillment', render: (r) => <StatusBadge status={r.fulfillmentStatus ?? 'unfulfilled'} /> },
              { key: 'when', label: 'Created', render: (r) => ago(r.createdAt) },
            ]}
          />
        )}
      </div>
    </div>
  );
}
