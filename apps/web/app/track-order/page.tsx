export const metadata = { title: 'Track order' };
export default function TrackOrder() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl font-bold">Track your order</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your order number and email to see the latest status.</p>
      <form className="mt-8 space-y-4">
        <input placeholder="Order number" className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        <input type="email" placeholder="Email address" className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
        <button className="btn-primary w-full">Look up my order</button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-500">Can’t find it? <a href="/contact" className="font-semibold text-brand hover:underline">Contact support</a>.</p>
    </main>
  );
}
