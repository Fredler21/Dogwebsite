import Link from 'next/link';
export default function Products() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded bg-brand px-4 py-2 text-sm text-white">New product</Link>
      </div>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Wire to Firestore `/products` (V2 collection). Add filters, search, archive, duplicate.
      </div>
    </div>
  );
}
