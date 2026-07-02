'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart, fmt } from '@/lib/cart';
import { getProducts, getCategory } from '@/lib/products';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    let on = true;
    getProducts().then((p) => on && setProducts(p));
    return () => {
      on = false;
    };
  }, []);

  if (products === null) {
    return <main className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-500">Loading…</main>;
  }

  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-slate-500">This product may have been removed or is no longer available.</p>
        <Link href="/shop" className="mt-4 inline-block text-brand hover:underline">← Back to shop</Link>
      </main>
    );
  }

  const cat = getCategory(product.categoryId);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const save = onSale ? (product.compareAtPrice as number) - product.price : 0;
  const full = Math.round(product.rating ?? 0);

  function handleAdd() {
    add({ productId: product!.id, title: product!.title, image: product!.images[0], unitPrice: product!.price, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <nav className="text-xs text-slate-500">
        <Link href="/" className="hover:text-brand">Home</Link> /{' '}
        <Link href="/shop" className="hover:text-brand">Shop</Link>
        {cat && <> / <Link href={`/collections/${cat.slug}`} className="hover:text-brand">{cat.name}</Link></>} /{' '}
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-cover" />
            {onSale && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-sm font-bold text-ink shadow">Sale</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square w-20 overflow-hidden rounded-xl border-2 transition ${i === activeImg ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.vendor && <div className="text-xs font-semibold uppercase tracking-wide text-brand">{product.vendor}</div>}
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{product.title}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <span className="text-brand-accent">{'★★★★★'.slice(0, full)}<span className="text-slate-300">{'★★★★★'.slice(full)}</span></span>
            {product.reviewCount ? <span>{product.rating} · {product.reviewCount.toLocaleString()} reviews</span> : null}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink">{fmt(product.price)}</span>
            {onSale && <span className="text-lg text-slate-400 line-through">{fmt(product.compareAtPrice as number)}</span>}
            {onSale && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-800">Save {fmt(save)}</span>}
          </div>

          <p className="mt-4 text-slate-600">{product.description}</p>
          <p className="mt-2 text-sm text-slate-500">🚚 Ships in 3–7 business days · Free over $50</p>

          {/* Quantity + add */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-300">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg text-slate-500 hover:text-ink" aria-label="Decrease quantity">−</button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-lg text-slate-500 hover:text-ink" aria-label="Increase quantity">+</button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 md:flex-none md:px-12">
              {added ? '✓ Added to cart' : `Add to cart · ${fmt(product.price * qty)}`}
            </button>
          </div>

          {/* Mini trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-200 py-4 text-center text-xs text-slate-600">
            <div><div className="text-lg">🔒</div>Secure checkout</div>
            <div><div className="text-lg">↩️</div>30-day returns</div>
            <div><div className="text-lg">💬</div>Real support</div>
          </div>

          {product.benefits && (
            <div className="mt-6">
              <h3 className="font-semibold text-ink">Why dogs love it</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {product.benefits.map(b => (
                  <li key={b} className="flex gap-2"><span className="text-brand">✓</span> {b}</li>
                ))}
              </ul>
            </div>
          )}

          {product.whatsIncluded && (
            <div className="mt-6">
              <h3 className="font-semibold text-ink">What’s included</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                {product.whatsIncluded.map(w => <li key={w}>{w}</li>)}
              </ul>
            </div>
          )}

          {product.faq && product.faq.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-ink">FAQ</h3>
              <div className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
                {product.faq.map(f => (
                  <details key={f.q} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
                      {f.q}<span className="text-slate-400 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
