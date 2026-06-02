'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

type SupplierRow = {
  id: string;
  name?: string;
  apiType?: string;
  status?: string;
  averageShippingDays?: number;
  onTimeRate?: number;
  defectRate?: number;
  rating?: number;
};

const pct = (n: number | undefined) => (typeof n === 'number' ? `${Math.round(n * 100)}%` : '—');

export default function SuppliersList() {
  const [rows, setRows] = useState<SupplierRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(fbDb(), 'suppliers'), orderBy('createdAt', 'desc'), limit(200));
        const snap = await getDocs(q);
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SupplierRow, 'id'>) })));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Link href="/admin/suppliers/new" className="rounded bg-brand px-4 py-2 text-sm text-white">
          New supplier
        </Link>
      </div>
      <div className="mt-6">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-slate-500">No suppliers yet.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <DataTable
            rows={rows}
            columns={[
              { key: 'name', label: 'Name', render: (r) => r.name ?? r.id },
              { key: 'api', label: 'Platform', render: (r) => r.apiType ?? '—' },
              { key: 'lead', label: 'Avg lead time', render: (r) => (typeof r.averageShippingDays === 'number' ? `${r.averageShippingDays}d` : '—') },
              { key: 'ontime', label: 'On-time', render: (r) => pct(r.onTimeRate) },
              { key: 'defect', label: 'Defect', render: (r) => pct(r.defectRate) },
              { key: 'rating', label: 'Rating', render: (r) => (typeof r.rating === 'number' ? r.rating.toFixed(1) : '—') },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status ?? 'inactive'} /> },
            ]}
          />
        )}
      </div>
    </div>
  );
}
