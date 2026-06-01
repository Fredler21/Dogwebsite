'use client';
import { useState } from 'react';

const PLATFORMS = [
  { v: 'cjdropshipping', l: 'CJ Dropshipping' },
  { v: 'aliexpress', l: 'AliExpress' },
  { v: 'private', l: 'Private supplier' },
  { v: 'other', l: 'Other' }
];

export default function NewSupplier() {
  const [form, setForm] = useState({
    name: '', contactEmail: '', contactName: '',
    platform: 'cjdropshipping', region: '', defaultLeadTimeDays: 14, notes: ''
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { getApps, initializeApp } = await import('firebase/app');
      const app = getApps()[0] ?? initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      });
      await httpsCallable(getFunctions(app), 'createSupplier')(form);
      setOk(true);
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  if (ok) return <div><h1 className="text-2xl font-bold">Supplier created</h1><a className="text-brand underline" href="/admin/suppliers">Back to list</a></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">New supplier</h1>
      <form onSubmit={submit} className="mt-6 max-w-xl space-y-4">
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input required type="email" placeholder="Contact email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input placeholder="Contact name" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2">
          {PLATFORMS.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
        </select>
        <input placeholder="Region (e.g. CN, US, EU)" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <label className="block text-sm">
          Default lead time (days)
          <input required type="number" min={1} max={90} value={form.defaultLeadTimeDays} onChange={e => setForm({ ...form, defaultLeadTimeDays: Number(e.target.value) })} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
        </label>
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="h-24 w-full rounded border border-slate-300 px-3 py-2" />
        <button disabled={busy} className="rounded bg-brand px-6 py-2 text-white disabled:opacity-50">{busy ? 'Saving…' : 'Create supplier'}</button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  );
}
