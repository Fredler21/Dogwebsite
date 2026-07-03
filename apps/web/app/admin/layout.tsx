'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { RequireAdmin } from '@/components/admin/RequireAdmin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login page is public and must be a clean, standalone screen —
  // no sidebar, no admin chrome, no auth gate.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Every other /admin route is gated: the sidebar + content only render
  // once RequireAdmin confirms an authorized, signed-in admin.
  return (
    <RequireAdmin>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </RequireAdmin>
  );
}
