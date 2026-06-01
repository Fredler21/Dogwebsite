export const metadata = { title: 'Track order' };
export default function TrackOrder() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold">Track your order</h1>
      <form className="mt-6 space-y-4">
        <input placeholder="Order number" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input type="email" placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2" />
        <button className="w-full rounded bg-brand py-2 text-white">Look up</button>
      </form>
    </main>
  );
}
