'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';
import { isAllowedAdminEmail } from '@/lib/adminAllowlist';

type State = { loading: boolean; isAdmin: boolean; email?: string };

export function RequireAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [s, setS] = useState<State>({ loading: true, isAdmin: false });

  useEffect(() => {
    // The login page itself must NOT be guarded.
    if (pathname === '/admin/login') {
      setS({ loading: false, isAdmin: true });
      return;
    }
    const unsub = onAuthStateChanged(fbAuth(), async (user) => {
      if (!user) {
        setS({ loading: false, isAdmin: false });
        return;
      }
      // Hard email allowlist. Anyone else gets force-signed-out.
      if (!isAllowedAdminEmail(user.email)) {
        await fbAuth().signOut();
        setS({ loading: false, isAdmin: false, email: user.email ?? undefined });
        return;
      }
      // Allowlisted email: show the panel. Firestore security rules
      // (which require the `admin === true` custom claim) remain the
      // authoritative gate for any data writes.
      setS({ loading: false, isAdmin: true, email: user.email ?? undefined });
    });
    return unsub;
  }, [pathname]);

  if (s.loading) return <div className="p-8 text-slate-500">Checking access…</div>;
  if (!s.isAdmin) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold">Admin only</h1>
        <p className="mt-2 text-slate-600">
          {s.email ? `${s.email} is not authorized.` : 'Sign in required.'}
        </p>
        <a href="/admin/login" className="mt-4 inline-block text-brand-accent underline">
          Go to login
        </a>
      </div>
    );
  }
  return <>{children}</>;
}
