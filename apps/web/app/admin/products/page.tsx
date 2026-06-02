'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { fbDb } from '@/lib/firebaseClient';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

type ProductRow = {
  id: string;
  title?: string;
  price?: number;
  status?: string;
  inventoryCount?: number;
  categoryId?: string;
};

const fmt = (c: number | undefined) => (typeof c === 'number' ? `$${(c / 100).toFixed(2)}` : '—');

export default function Products() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(fbDb(), 'products'), orderBy('createdAt', 'desc'), limit(200));
        const snap = await getDocs(q);
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProductRow, 'id'>) })));
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
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-brand px-4 py-2 text-sm text-white">
          New product
        </Link>
      </div>
      <div className="mt-6">
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && rows.length === 0 && (
          <p className="text-sm text-slate-500">No products yet.</p>
        )}
        {!loading && !error && rows.length > 0 && (
          <DataTable
            rows={rows}
            columns={[
              { key: 'title', label: 'Title', render: (r) => r.title ?? r.id },
              { key: 'price', label: 'Price', render: (r) => fmt(r.price) },
              { key: 'cat', label: 'Category', render: (r) => r.categoryId ?? '—' },
              { key: 'inv', label: 'Stock', render: (r) => (typeof r.inventoryCount === 'number' ? r.inventoryCount : '—') },
              { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status ?? 'draft'} /> },
            ]}
          />
        )}
      </div>
    </div>
  );
}
