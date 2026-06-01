'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    try {
      await signInWithEmailAndPassword(fbAuth(), email, pass);
      window.location.href = '/admin';
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Login failed'); }
  }
  return (
    <main className="mx-auto mt-16 max-w-sm p-6">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded border border-slate-300 px-3 py-2" />
        <input type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" className="w-full rounded border border-slate-300 px-3 py-2" />
        <button className="w-full rounded bg-brand py-2 text-white">Sign in</button>
        {err && <div className="text-sm text-red-600">{err}</div>}
      </form>
    </main>
  );
}
