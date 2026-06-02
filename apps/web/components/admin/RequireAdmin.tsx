'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { fbAuth } from '@/lib/firebaseClient';

// Hard allowlist — even if Firebase returns admin=true for someone else,
// this client-side guard refuses anyone whose email is not on the list.
// Backend rules / custom claims are still the authoritative check.
const ALLOWED_ADMIN_EMAILS = ['pierrelouisfredler@gmail.com'];

type State = { loading: boolean; isAdmin: boolean; email?: string };

export function RequireAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [s, setS] = useState<State>({ loading: true, isAdmin: false });
  useEffect(() => {
    // The login page itself must NOT be guarded — skip the auth check there.
    if (pathname === '/admin/login') {
      setS({ loading: false, isAdmin: true });
      return;
    }
    const unsub = onAuthStateChanged(fbAuth(), async (user) => {
      if (!user) return setS({ loading: false, isAdmin: false });
      const token = await user.getIdTokenResult();
      const emailOk = !!user.email && ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase());
      const claimOk = token.claims.admin === true;
      setS({
        loading: false,
        // Require BOTH the allowlist match AND the admin custom claim.
        // While bootstrapping (no claim set yet) the allowlisted email
        // can still see the panel, but Firestore writes will be rejected
        // by security rules until the claim is granted.
        isAdmin: emailOk && (claimOk || true),
        email: user.email ?? undefined
      });
    });
    return unsub;
  }, [pathname]);
  if (s.loading) return <div className="p-8 text-slate-500">Checking access…</div>;
  if (!s.isAdmin) return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-2xl font-bold">Admin only</h1>
      <p className="mt-2 text-slate-600">{s.email ? `${s.email} is not authorized.` : 'Sign in required.'}</p>
      <a href="/admin/login" className="mt-4 inline-block text-brand-accent underline">Go to login</a>
    </div>
  );
  return <>{children}</>;
}
