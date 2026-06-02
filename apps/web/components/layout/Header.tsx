'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

export function Header() {
  const { count } = useCart();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold tracking-tight">Dogvanta</Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/shop" className="text-sm hover:text-brand-accent">Shop</Link>
          <Link href="/collections/interior-accessories" className="text-sm hover:text-brand-accent">Interior</Link>
          <Link href="/collections/cleaning-tools" className="text-sm hover:text-brand-accent">Cleaning</Link>
          <Link href="/support" className="text-sm hover:text-brand-accent">Support</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/admin/login" className="text-sm text-slate-500 hover:text-brand-accent">Sign in</Link>
          <Link href="/cart" className="rounded-full border border-slate-300 px-4 py-1.5 text-sm">Cart ({count})</Link>
        </div>
      </div>
    </header>
  );
}
