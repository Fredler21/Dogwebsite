'use client';
import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/lib/mockProducts';

export default function ShopPage() {
  const [cat, setCat] = useState<string>('');
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => PRODUCTS.filter(p => (!cat || p.categoryId === cat) && (!q || p.title.toLowerCase().includes(q.toLowerCase()))),
    [cat, q]
  );
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Shop</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." className="flex-1 rounded-md border border-slate-300 px-4 py-2 md:max-w-xs" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-md border border-slate-300 px-4 py-2">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </main>
  );
}
