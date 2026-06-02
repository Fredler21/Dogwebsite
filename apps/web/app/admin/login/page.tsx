'use client';
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';

// Allowlist — ONLY these emails can sign in to the admin panel.
// Update here AND in firestore.rules / SUPER_ADMIN_EMAIL secret if you ever add another admin.
const ALLOWED_ADMIN_EMAILS = ['pierrelouisfredler@gmail.com'];

function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function emailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (!isAllowed(email)) {
        throw new Error('This email is not authorized.');
      }
      await signInWithEmailAndPassword(fbAuth(), email, pass);
      window.location.href = '/admin';
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function googleSubmit() {
    setErr(''); setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(fbAuth(), provider);
      if (!isAllowed(result.user.email)) {
        // Sign them out immediately — only the allowlisted email is permitted.
        await fbAuth().signOut();
        throw new Error(`${result.user.email} is not authorized.`);
      }
      window.location.href = '/admin';
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-sm p-6">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      <p className="mt-2 text-sm text-slate-600">Restricted access.</p>

      <button
        onClick={googleSubmit}
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12.5 24 12.5c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2 14-5.3l-6.5-5.3c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-3.4-11.3-8L6.3 32.3C9.6 38.4 16.3 43.5 24 43.5z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.5 5.3c4.5-4.1 7-10.1 7-15.6 0-1.2-.1-2.3-.4-3.5z"/>
        </svg>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        OR
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={emailSubmit} className="space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Password"
          className="w-full rounded border border-slate-300 px-3 py-2"
        />
        <button
          disabled={busy}
          className="w-full rounded bg-brand py-2 text-white disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in with email'}
        </button>
        {err && <div className="text-sm text-red-600">{err}</div>}
      </form>
    </main>
  );
}
