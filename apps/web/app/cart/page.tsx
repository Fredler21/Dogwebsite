'use client';
import Link from 'next/link';
import { useCart, fmt } from '@/lib/cart';

const FREE_SHIPPING = 5000; // cents

export default function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-4 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Looks like your pup hasn’t picked anything yet.</p>
        <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
      </main>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING) * 100));

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>

      {/* Free shipping progress */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          {remaining > 0 ? <>You’re <span className="font-semibold text-brand">{fmt(remaining)}</span> away from free shipping! 🚚</> : <span className="font-semibold text-brand">🎉 You’ve unlocked free shipping!</span>}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="divide-y divide-slate-200 md:col-span-2">
          {items.map(i => (
            <div key={`${i.productId}-${i.variantId ?? ''}`} className="flex gap-4 py-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt="" className="h-24 w-24 rounded-xl bg-slate-100 object-cover" />
              <div className="flex-1">
                <div className="font-semibold text-ink">{i.title}</div>
                <div className="text-sm text-slate-500">{fmt(i.unitPrice)}</div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-slate-300">
                    <button onClick={() => setQty(i.productId, i.quantity - 1, i.variantId)} className="px-3 py-1 text-slate-500 hover:text-ink" aria-label="Decrease">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => setQty(i.productId, i.quantity + 1, i.variantId)} className="px-3 py-1 text-slate-500 hover:text-ink" aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(i.productId, i.variantId)} className="text-xs text-slate-500 underline hover:text-red-600">Remove</button>
                </div>
              </div>
              <div className="font-semibold text-ink">{fmt(i.unitPrice * i.quantity)}</div>
            </div>
          ))}
          <div className="pt-5">
            <Link href="/shop" className="text-sm font-semibold text-brand hover:underline">← Continue shopping</Link>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{remaining > 0 ? 'Calculated at checkout' : 'Free'}</span></div>
          </div>
          <input placeholder="Discount code" className="mt-4 w-full rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand focus:outline-none" />
          <Link href="/checkout" className="btn-primary mt-4 w-full">Checkout · {fmt(subtotal)}</Link>
          <div className="mt-4 space-y-1 text-center text-xs text-slate-500">
            <div>🔒 Secure checkout · Powered by Stripe</div>
            <div>✓ Tracked shipping · ✓ 30-day returns</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
