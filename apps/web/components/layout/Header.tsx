'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { LogoMark } from '@/components/brand/LogoMark';

const NAV = [
  { href: '/shop', label: 'Shop all' },
  { href: '/collections/toys', label: 'Toys' },
  { href: '/collections/beds', label: 'Beds' },
  { href: '/collections/walking-gear', label: 'Walking' },
  { href: '/collections/grooming', label: 'Grooming' },
  { href: '/collections/feeding', label: 'Feeding' }
];

const ANNOUNCEMENTS = [
  'Free shipping on orders over $50',
  '30-day happiness guarantee',
  'Tracked delivery worldwide',
  '★ 25,000+ happy dogs and counting'
];

export function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement marquee bar */}
      <div className="overflow-hidden bg-brand text-white">
        <div className="marquee-track flex w-max whitespace-nowrap py-2 text-xs font-medium tracking-wide">
          {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-2">
              <span className="text-brand-accent">•</span> {a}
            </span>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden"
          >
            <MenuIcon />
          </button>

          <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
            <LogoMark size={30} />
            <span className="font-display">Refined Paw</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="text-sm font-medium text-slate-700 transition hover:text-brand">
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={onSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search for toys, beds, treats…"
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button type="submit" aria-label="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 md:ml-2">
            <Link href="/track-order" aria-label="Track order" className="hidden text-slate-600 transition hover:text-brand sm:block" title="Track order">
              <UserIcon />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative text-slate-700 transition hover:text-brand">
              <CartIcon />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-accent px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <form onSubmit={onSearch} className="relative mb-4">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map(n => (
                <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
