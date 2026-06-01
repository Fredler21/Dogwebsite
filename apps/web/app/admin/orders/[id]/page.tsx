'use client';
import { useState } from 'react';
import { MOCK_ORDERS } from '@/lib/mockData';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function OrderDetail({ params }: { params: { id: string } }) {
  const order = MOCK_ORDERS.find(o => o.id === params.id);
  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [notes, setNotes] = useState('');
  if (!order) return <div>Order not found</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
        <StatusBadge status={order.paymentStatus} />
        <StatusBadge status={order.fulfillmentStatus} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-2">
          <h2 className="font-semibold">Customer</h2>
          <p className="mt-2 text-sm text-slate-600">{order.customerEmail}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Fulfillment</h2>
          <div className="mt-3 space-y-3 text-sm">
            <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Tracking number" className="w-full rounded border border-slate-300 px-3 py-2" />
            <select value={carrier} onChange={e => setCarrier(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
              <option>USPS</option><option>UPS</option><option>FedEx</option><option>DHL</option>
            </select>
            <button className="w-full rounded bg-brand py-2 text-white" onClick={() => alert('Calls adminUpdateOrderStatus (V2/V9)')}>Mark shipped</button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Admin notes</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="mt-3 h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-semibold">AI recommendations</h2>
        <p className="mt-2 text-sm text-slate-700">Populated in V6 by `aiMonitorOrders`. Suggestions require admin approval.</p>
      </div>
    </div>
  );
}
