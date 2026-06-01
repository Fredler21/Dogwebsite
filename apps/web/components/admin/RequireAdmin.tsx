'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';

type State = { loading: boolean; isAdmin: boolean; email?: string };

export function RequireAdmin({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>({ loading: true, isAdmin: false });
  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth(), async (user) => {
      if (!user) return setS({ loading: false, isAdmin: false });
      const token = await user.getIdTokenResult();
      setS({ loading: false, isAdmin: token.claims.admin === true, email: user.email ?? undefined });
    });
    return unsub;
  }, []);
  if (s.loading) return <div className="p-8 text-slate-500">Checking access…</div>;
  if (!s.isAdmin) return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-2xl font-bold">Admin only</h1>
      <p className="mt-2 text-slate-600">{s.email ? `${s.email} is not an admin.` : 'Sign in required.'}</p>
      <a href="/admin/login" className="mt-4 inline-block text-brand-accent underline">Go to login</a>
    </div>
  );
  return <>{children}</>;
}
