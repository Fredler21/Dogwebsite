'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LogoMark } from '@/components/brand/LogoMark';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      {/* Newsletter */}
      <div className="bg-brand text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-bold">Join the pack 🐾</h3>
            <p className="mt-2 text-sm text-white/80">Get 10% off your first order plus new drops, training tips, and exclusive deals.</p>
          </div>
          {subscribed ? (
            <p className="rounded-lg bg-white/10 px-4 py-3 text-sm font-medium md:justify-self-end">Thanks! Check your inbox for your 10% off code.</p>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email.includes('@')) setSubscribed(true); }}
              className="flex gap-2 md:justify-self-end"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full min-w-0 rounded-full border-0 px-5 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent md:w-72"
              />
              <button type="submit" className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-ink transition hover:opacity-90">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 text-sm md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-xl font-extrabold text-ink">
            <LogoMark size={26} /> <span className="font-display">Dogvanta</span>
          </div>
          <p className="mt-3 max-w-xs text-slate-600">Thoughtfully made gear for happy, healthy dogs, shipped to your door with a 30-day happiness guarantee.</p>
          <div className="mt-4 flex gap-3 text-slate-500">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-brand">Instagram</a>
            <span aria-hidden>·</span>
            <a href="https://tiktok.com" aria-label="TikTok" className="hover:text-brand">TikTok</a>
            <span aria-hidden>·</span>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-brand">Facebook</a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-ink">Shop</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/shop" className="hover:text-brand">All products</Link></li>
            <li><Link href="/collections/toys" className="hover:text-brand">Toys</Link></li>
            <li><Link href="/collections/beds" className="hover:text-brand">Beds</Link></li>
            <li><Link href="/collections/walking-gear" className="hover:text-brand">Walking gear</Link></li>
            <li><Link href="/collections/grooming" className="hover:text-brand">Grooming</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink">Help</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/track-order" className="hover:text-brand">Track order</Link></li>
            <li><Link href="/contact" className="hover:text-brand">Contact us</Link></li>
            <li><Link href="/faq" className="hover:text-brand">FAQ</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-brand">Shipping</Link></li>
            <li><Link href="/return-policy" className="hover:text-brand">Returns</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink">Company</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/about" className="hover:text-brand">About us</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-brand">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-brand">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 md:flex-row">
          <span>© {2026} Dogvanta. All rights reserved.</span>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay', 'G Pay'].map(m => (
              <span key={m} className="rounded border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-500">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
