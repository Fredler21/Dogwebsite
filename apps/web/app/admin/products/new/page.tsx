'use client';
import { useState } from 'react';

export default function NewProduct() {
  const [form, setForm] = useState({ title: '', slug: '', description: '', categoryId: '', price: 0, supplierCost: 0, shippingCost: 0 });
  const profit = form.price - form.supplierCost - form.shippingCost;
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">New product</h1>
      <form className="mt-6 space-y-4">
        {(['title','slug','categoryId'] as const).map(k => (
          <label key={k} className="block">
            <span className="text-sm font-medium capitalize">{k}</span>
            <input value={form[k] as string} onChange={e => setForm({ ...form, [k]: e.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1 h-24 w-full rounded border border-slate-300 px-3 py-2" />
        </label>
        <div className="grid gap-4 md:grid-cols-3">
          {(['price','supplierCost','shippingCost'] as const).map(k => (
            <label key={k} className="block">
              <span className="text-sm font-medium">{k} (cents)</span>
              <input type="number" value={form[k] as number} onChange={e => setForm({ ...form, [k]: +e.target.value })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
          ))}
        </div>
        <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">Estimated profit: ${(profit / 100).toFixed(2)}</div>
        <button type="button" className="rounded bg-brand px-4 py-2 text-white" onClick={() => alert('Wire to Firestore in V2 integration')}>Save</button>
      </form>
    </div>
  );
}
