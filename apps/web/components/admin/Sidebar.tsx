import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/suppliers', label: 'Suppliers' },
  { href: '/admin/support', label: 'Support' },
  { href: '/admin/discounts', label: 'Discounts' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/ai', label: 'AI Center' },
  { href: '/admin/settings', label: 'Settings' }
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-slate-200 bg-white p-4">
      <div className="px-2 text-xl font-bold">Dogvanta</div>
      <nav className="mt-6 space-y-1">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className="block rounded px-3 py-2 text-sm hover:bg-slate-100">{n.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
