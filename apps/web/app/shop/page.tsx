'use client';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, CATEGORIES } from '@/lib/products';
import type { Product } from '@/lib/types';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function ShopPage() {
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Pick up a search query passed from the header (?q=...) without needing Suspense.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query) setQ(query);
  }, []);

  // Load live products from Firestore (falls back to the demo catalogue).
  useEffect(() => {
    let active = true;
    getProducts()
      .then((p) => active && setProducts(p))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(
      p => (!cat || p.categoryId === cat) && (!q || p.title.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [products, cat, q, sort]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <nav className="text-xs text-slate-500">Home / <span className="text-ink">Shop</span></nav>
      <h1 className="mt-2 font-display text-4xl font-bold">Shop all</h1>
      <p className="mt-1 text-sm text-slate-500">Vet-approved gear for happy, healthy dogs.</p>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCat('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === '' ? 'bg-brand text-white' : 'border border-slate-300 text-slate-600 hover:border-slate-900'}`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c.id ? 'bg-brand text-white' : 'border border-slate-300 text-slate-600 hover:border-slate-900'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Search + sort */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search products…"
          className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand md:max-w-xs"
        />
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-slate-500">{filtered.length} products</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as Sort)}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="mt-16 text-center text-slate-500">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">No products match your search. Try another term or category.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </main>
  );
}
