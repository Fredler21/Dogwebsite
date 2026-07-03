import Link from 'next/link';

export default function OrderSuccess({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="mt-4 font-display text-3xl font-bold">Thank you for your order!</h1>
      <p className="mt-2 text-slate-600">A confirmation email is on its way. We’ll send tracking as soon as your order ships, usually within 1 to 2 business days.</p>
      <Link href="/shop" className="btn-primary mt-8">Continue shopping</Link>
      {searchParams.session_id && <p className="mt-6 text-xs text-slate-400">Order ref: {searchParams.session_id}</p>}
    </main>
  );
}
