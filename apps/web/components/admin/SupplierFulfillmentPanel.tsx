'use client';
import { useState } from 'react';

interface Props { orderId: string; }

const STATUSES = ['awaiting','sourced','shipped','delivered','cancelled','issue'] as const;

export default function SupplierFulfillmentPanel({ orderId }: Props) {
  const [supplierId, setSupplierId] = useState('');
  const [costDollars, setCostDollars] = useState(0);
  const [status, setStatus] = useState<typeof STATUSES[number]>('awaiting');
  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function callFn(name: string, data: unknown) {
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    const { getApps, initializeApp } = await import('firebase/app');
    const app = getApps()[0] ?? initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    });
    return httpsCallable(getFunctions(app), name)(data);
  }

  async function assign() {
    setBusy(true); setMsg('');
    try {
      await callFn('assignSupplierToOrder', { orderId, supplierId, costCents: Math.round(costDollars * 100) });
      setMsg('Supplier assigned.');
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  }

  async function pushStatus() {
    setBusy(true); setMsg('');
    try {
      await callFn('updateSupplierOrderStatus', {
        supplierOrderId: orderId, // assumes caller passes the supplierOrderId here
        status, trackingNumber: tracking || undefined, trackingCarrier: carrier || undefined
      });
      setMsg('Status updated.');
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">Supplier fulfillment</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input placeholder="Supplier ID" value={supplierId} onChange={e => setSupplierId(e.target.value)} className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input type="number" step="0.01" placeholder="Cost ($)" value={costDollars} onChange={e => setCostDollars(Number(e.target.value))} className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <button onClick={assign} disabled={busy || !supplierId} className="rounded bg-brand px-3 py-2 text-sm text-white disabled:opacity-50">Assign supplier</button>
      </div>
      <hr className="my-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={status} onChange={e => setStatus(e.target.value as typeof STATUSES[number])} className="rounded border border-slate-300 px-3 py-2 text-sm">
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Tracking number (when shipped)" value={tracking} onChange={e => setTracking(e.target.value)} className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <input placeholder="Carrier" value={carrier} onChange={e => setCarrier(e.target.value)} className="rounded border border-slate-300 px-3 py-2 text-sm" />
        <button onClick={pushStatus} disabled={busy} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">Update status</button>
      </div>
      {msg && <p className="mt-3 text-xs text-slate-600">{msg}</p>}
    </div>
  );
}
