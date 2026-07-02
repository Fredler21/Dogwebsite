import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Checkout canceled</h1>
      <p className="mt-2 text-slate-600">No worries — your cart is still saved. Come back whenever you’re ready.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/cart" className="btn-primary">Return to cart</Link>
        <Link href="/shop" className="btn-outline">Keep shopping</Link>
      </div>
    </main>
  );
}
