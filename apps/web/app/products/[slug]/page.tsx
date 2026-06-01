'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import { useCart, fmt } from '@/lib/cart';
import { findProduct, PRODUCTS } from '@/lib/mockProducts';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = findProduct(params.slug);
  if (!product) return notFound();
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const related = PRODUCTS.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{fmt(product.price)}</span>
            {product.compareAtPrice && <span className="text-slate-500 line-through">{fmt(product.compareAtPrice)}</span>}
          </div>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <div className="mt-4 text-sm text-slate-600">Ships in 3-7 business days.</div>
          <div className="mt-6 flex items-center gap-3">
            <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, +e.target.value))} className="w-20 rounded-md border border-slate-300 px-3 py-2" />
            <button
              onClick={() => add({ productId: product.id, title: product.title, image: product.images[0], unitPrice: product.price, quantity: qty })}
              className="rounded-md bg-brand px-6 py-2 text-white hover:bg-slate-800">
              Add to cart
            </button>
          </div>
          {product.benefits && (
            <div className="mt-8">
              <h3 className="font-semibold">Benefits</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">{product.benefits.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">{related.map(p => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      )}
    </main>
  );
}
