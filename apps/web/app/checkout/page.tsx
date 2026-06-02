'use client';
import { useState } from 'react';
import { startCheckout } from '@/lib/checkout';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [discount, setDiscount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ayu_cart_v1') : null;
      const items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items) || items.length === 0) {
        setError('Your cart is empty.');
        setLoading(false);
        return;
      }
      await startCheckout({
        items: items.map((i: { productId: string; quantity: number; variantId?: string }) => ({
          productId: i.productId,
          quantity: i.quantity,
          variantId: i.variantId,
        })),
        customerEmail: email,
        discountCode: discount.trim() || undefined,
      });
    } catch (err) {
      setError((err as Error).message || 'Could not start checkout.');
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold text-center">Checkout</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        We&apos;ll send your receipt and order updates to this email.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-slate-700">
            Discount code <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="discount"
            type="text"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="WELCOME10"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Redirecting to Stripe…' : 'Continue to secure checkout'}
        </button>
        <p className="text-center text-xs text-slate-500">
          Payments are securely processed by Stripe.
        </p>
      </form>
    </main>
  );
}
