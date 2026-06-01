'use client';
import { useEffect, useState } from 'react';
import { startCheckout } from '@/lib/checkout';

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ayu_cart_v1');
      const items = raw ? JSON.parse(raw) : [];
      const email = prompt('Email for receipt:') ?? '';
      if (!email) { setError('Email required'); return; }
      startCheckout({
        items: items.map((i: { productId: string; quantity: number; variantId?: string }) => ({
          productId: i.productId, quantity: i.quantity, variantId: i.variantId
        })),
        customerEmail: email
      }).catch(e => setError(e.message));
    } catch (e) { setError((e as Error).message); }
  }, []);
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Redirecting to secure checkout…</h1>
      <p className="mt-2 text-slate-600">You will be redirected to Stripe.</p>
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </main>
  );
}
