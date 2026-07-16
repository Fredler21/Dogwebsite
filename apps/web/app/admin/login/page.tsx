'use client';
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';
import { isAllowedAdminEmail } from '@/lib/adminAllowlist';

export default function AdminLogin() {
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function googleSubmit() {
    setErr('');
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(fbAuth(), provider);
      if (!isAllowedAdminEmail(result.user.email)) {
        await fbAuth().signOut();
        throw new Error(`${result.user.email ?? 'This account'} is not authorized.`);
      }
      window.location.href = '/admin';
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Google sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
            D
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Log in to Refined Paw</h1>
          <p className="mt-1 text-sm text-slate-500">Continue to your admin dashboard</p>
        </div>

        <button
          onClick={googleSubmit}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.3 19 12.5 24 12.5c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2 14-5.3l-6.5-5.3c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-3.4-11.3-8L6.3 32.3C9.6 38.4 16.3 43.5 24 43.5z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.5 5.3c4.5-4.1 7-10.1 7-15.6 0-1.2-.1-2.3-.4-3.5z" />
          </svg>
          {busy ? 'Signing in…' : 'Continue with Google'}
        </button>

        {err && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          Restricted access. Only authorized staff may sign in.
        </p>
      </div>
    </main>
  );
}
