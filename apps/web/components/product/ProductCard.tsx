'use client';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { fmt } from '@/lib/format';
import { useCart } from '@/lib/cart';

function Stars({ rating = 0 }: { rating?: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-brand-accent" aria-label={`${rating} out of 5`}>
      {'★★★★★'.slice(0, full)}
      <span className="text-slate-300">{'★★★★★'.slice(full)}</span>
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price;
  const discount = onSale ? Math.round((1 - p.price / (p.compareAtPrice as number)) * 100) : 0;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${p.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-xs font-bold text-ink shadow">
              -{discount}%
            </span>
          )}
          {p.badge && (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand shadow">
              {p.badge}
            </span>
          )}

          {/* Quick add — slides up on hover (desktop) */}
          <button
            onClick={e => {
              e.preventDefault();
              add({ productId: p.id, title: p.title, image: p.images[0], unitPrice: p.price, quantity: 1 });
            }}
            className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-ink py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 hover:bg-brand group-hover:translate-y-0 group-hover:opacity-100"
          >
            Add to cart
          </button>
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link href={`/products/${p.slug}`} className="text-sm font-semibold text-ink hover:text-brand">
          {p.title}
        </Link>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Stars rating={p.rating} />
          {p.reviewCount ? <span>({p.reviewCount.toLocaleString()})</span> : null}
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-bold text-ink">{fmt(p.price)}</span>
          {onSale && <span className="text-sm text-slate-400 line-through">{fmt(p.compareAtPrice as number)}</span>}
        </div>
      </div>
    </div>
  );
}
