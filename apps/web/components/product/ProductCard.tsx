import Link from 'next/link';
import type { Product } from '@/lib/types';
import { fmt } from '@/lib/cart';

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="mt-2">
        <div className="text-sm font-medium">{p.title}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold">{fmt(p.price)}</span>
          {p.compareAtPrice && <span className="text-xs text-slate-500 line-through">{fmt(p.compareAtPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
