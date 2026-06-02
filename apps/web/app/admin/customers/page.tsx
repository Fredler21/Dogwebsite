'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { DataTable } from '@/components/admin/DataTable';

type CustomerRow = {
  id: string;
  email?: string;
  displayName?: string;
  totalSpent?: number;
  ordersCount?: number;
  createdAt?: number;
  admin?: boolean;
};

const fmt = (c: number | undefined) => (typeof c === 'number' ? `$${(c / 100).toFixed(2)}` : '—');
const when = (t: number | undefined) =>
  t ? new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function Page() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(fbDb(), 'users'), orderBy('createdAt', 'desc'), limit(200));
        const snap = await getDocs(q);
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CustomerRow, 'id'>) })));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="mt-6">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-slate-500">No customers yet.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <DataTable
            rows={rows}
            columns={[
              { key: 'email', label: 'Email', render: (r) => r.email ?? r.id },
              { key: 'name', label: 'Name', render: (r) => r.displayName ?? '—' },
              { key: 'orders', label: 'Orders', render: (r) => r.ordersCount ?? 0 },
              { key: 'spent', label: 'Total spent', render: (r) => fmt(r.totalSpent) },
              { key: 'role', label: 'Role', render: (r) => (r.admin ? 'Admin' : 'Customer') },
              { key: 'when', label: 'Joined', render: (r) => when(r.createdAt) },
            ]}
          />
        )}
      </div>
    </div>
  );
}
