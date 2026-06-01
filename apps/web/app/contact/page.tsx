'use client';
import { useState } from 'react';

const CATEGORIES = [
  { v: 'tracking', l: 'Tracking issue' },
  { v: 'refund', l: 'Refund request' },
  { v: 'return', l: 'Return' },
  { v: 'damaged', l: 'Damaged item' },
  { v: 'wrong_item', l: 'Wrong item received' },
  { v: 'payment', l: 'Payment problem' },
  { v: 'general', l: 'General question' }
];

export default function ContactPage() {
  const [form, setForm] = useState({ customerEmail: '', orderId: '', category: 'general', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending'); setErr('');
    try {
      // Calls Firebase callable `createSupportTicket` (V5 backend).
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { getApps, initializeApp } = await import('firebase/app');
      const app = getApps()[0] ?? initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      });
      await httpsCallable(getFunctions(app), 'createSupportTicket')(form);
      setStatus('sent');
    } catch (e) { setErr((e as Error).message); setStatus('error'); }
  }

  if (status === 'sent') return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Message received</h1>
      <p className="mt-2 text-slate-600">We typically reply within one business day.</p>
    </main>
  );

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required type="email" placeholder="Your email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <input placeholder="Order number (optional)" value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2">
          {CATEGORIES.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
        </select>
        <input required placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full rounded border border-slate-300 px-3 py-2" />
        <textarea required minLength={10} maxLength={5000} placeholder="How can we help? (min 10 chars)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="h-32 w-full rounded border border-slate-300 px-3 py-2" />
        <button disabled={status === 'sending'} className="rounded bg-brand px-6 py-2 text-white disabled:opacity-50">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </main>
  );
}
