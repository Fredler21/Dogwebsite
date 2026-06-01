'use client';
import Link from 'next/link';
import { useCart, fmt } from '@/lib/cart';

export default function CartPage() {
  const { items, remove, setQty, subtotal } = useCart();
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link href="/shop" className="mt-4 inline-block text-brand-accent underline">Browse products</Link>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Cart</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-3">
        <div className="divide-y divide-slate-200 md:col-span-2">
          {items.map(i => (
            <div key={`${i.productId}-${i.variantId ?? ''}`} className="flex gap-4 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt="" className="h-20 w-20 rounded bg-slate-100 object-cover" />
              <div className="flex-1">
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-slate-600">{fmt(i.unitPrice)}</div>
                <div className="mt-2 flex items-center gap-3">
                  <input type="number" min={1} value={i.quantity} onChange={e => setQty(i.productId, +e.target.value, i.variantId)} className="w-16 rounded border border-slate-300 px-2 py-1" />
                  <button onClick={() => remove(i.productId, i.variantId)} className="text-xs text-slate-500 underline">Remove</button>
                </div>
              </div>
              <div className="font-semibold">{fmt(i.unitPrice * i.quantity)}</div>
            </div>
          ))}
        </div>
        <aside className="rounded-lg border border-slate-200 p-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Shipping</span><span>At checkout</span></div>
          </div>
          <input placeholder="Discount code" className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          <Link href="/checkout" className="mt-4 block w-full rounded-md bg-brand py-2 text-center text-white">Checkout</Link>
          <div className="mt-4 text-center text-xs text-slate-500">✓ Secure checkout · ✓ Tracked shipping</div>
        </aside>
      </div>
    </main>
  );
}
