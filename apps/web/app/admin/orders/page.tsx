import Link from 'next/link';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MOCK_ORDERS } from '@/lib/mockData';

const fmt = (c: number) => `$${(c / 100).toFixed(2)}`;
const ago = (t: number) => {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <div className="mt-6">
        <DataTable
          rows={MOCK_ORDERS}
          columns={[
            { key: 'num', label: 'Order', render: r => <Link className="text-brand-accent underline" href={`/admin/orders/${r.id}`}>{r.orderNumber}</Link> },
            { key: 'email', label: 'Customer', render: r => r.customerEmail },
            { key: 'total', label: 'Total', render: r => fmt(r.grandTotal) },
            { key: 'pay', label: 'Payment', render: r => <StatusBadge status={r.paymentStatus} /> },
            { key: 'ful', label: 'Fulfillment', render: r => <StatusBadge status={r.fulfillmentStatus} /> },
            { key: 'when', label: 'Created', render: r => ago(r.createdAt) }
          ]}
        />
      </div>
    </div>
  );
}
