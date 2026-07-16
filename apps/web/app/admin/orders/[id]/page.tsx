'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { fb, fbDb } from '@/lib/firebaseClient';
import { StatusBadge } from '@/components/admin/StatusBadge';

type OrderItem = { productId: string; variantId?: string | null; quantity: number; unitPrice: number };
type Order = {
  orderNumber?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  subtotal?: number;
  discountTotal?: number;
  grandTotal?: number;
  refundedAmount?: number;
  items?: OrderItem[];
  shippingName?: string;
  shippingAddress?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } | null;
  trackingNumber?: string;
  trackingCarrier?: string;
  stripePaymentIntentId?: string;
};

const fmt = (c: number | undefined) => (typeof c === 'number' ? `$${(c / 100).toFixed(2)}` : '—');

// Call an admin callable in us-central1 (matches deployed region).
async function callAdmin<T = unknown>(name: string, payload: unknown): Promise<T> {
  const { getFunctions, httpsCallable } = await import('firebase/functions');
  const res = await httpsCallable<unknown, T>(getFunctions(fb()), name)(payload);
  return res.data;
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [shipMsg, setShipMsg] = useState<string | null>(null);
  const [shipping, setShipping] = useState(false);

  const [refundAmount, setRefundAmount] = useState(''); // dollars; blank = full
  const [refundMsg, setRefundMsg] = useState<string | null>(null);
  const [refunding, setRefunding] = useState(false);

  const load = useCallback(async () => {
    try {
      const snap = await getDoc(doc(fbDb(), 'orders', params.id));
      if (!snap.exists()) {
        setError('Order not found');
      } else {
        const data = snap.data() as Order;
        setOrder(data);
        setTracking(data.trackingNumber ?? '');
        if (data.trackingCarrier) setCarrier(data.trackingCarrier);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function markShipped() {
    if (!tracking.trim()) {
      setShipMsg('Enter a tracking number first.');
      return;
    }
    setShipping(true);
    setShipMsg(null);
    try {
      await callAdmin('adminUpdateOrderStatus', {
        orderId: params.id,
        fulfillmentStatus: 'shipped',
        trackingNumber: tracking.trim(),
        trackingCarrier: carrier,
      });
      setShipMsg('Marked as shipped. Customer emailed a tracking update.');
      await load();
    } catch (e) {
      setShipMsg((e as Error).message);
    } finally {
      setShipping(false);
    }
  }

  async function refund() {
    const refundable = (order?.grandTotal ?? 0) - (order?.refundedAmount ?? 0);
    let amountCents: number | undefined;
    if (refundAmount.trim()) {
      const dollars = Number(refundAmount);
      if (!Number.isFinite(dollars) || dollars <= 0) {
        setRefundMsg('Enter a valid refund amount, or leave blank to refund the full balance.');
        return;
      }
      amountCents = Math.round(dollars * 100);
      if (amountCents > refundable) {
        setRefundMsg(`Amount exceeds refundable balance (${fmt(refundable)}).`);
        return;
      }
    }
    const label = amountCents ? fmt(amountCents) : `the full ${fmt(refundable)}`;
    if (!window.confirm(`Refund ${label} to the customer? This charges it back through Stripe and cannot be undone.`)) {
      return;
    }
    setRefunding(true);
    setRefundMsg(null);
    try {
      const res = await callAdmin<{ refundId: string; amount: number; status: string }>('processRefundRequest', {
        orderId: params.id,
        ...(amountCents ? { amount: amountCents } : {}),
      });
      setRefundMsg(`Refund submitted to Stripe (${res.refundId}, ${res.status}). Payment status updates here within a few seconds.`);
      setRefundAmount('');
      // The charge.refunded webhook updates the order doc asynchronously; refetch shortly.
      setTimeout(load, 4000);
    } catch (e) {
      setRefundMsg((e as Error).message);
    } finally {
      setRefunding(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (error || !order) return <div className="text-sm text-red-600">{error ?? 'Order not found'}</div>;

  const refundable = (order.grandTotal ?? 0) - (order.refundedAmount ?? 0);
  const canRefund =
    (order.paymentStatus === 'paid' || order.paymentStatus === 'partially_refunded') && refundable > 0;
  const addr = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-sm text-brand-accent underline">
          ← All orders
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{order.orderNumber ?? params.id.slice(0, 8)}</h1>
        <StatusBadge status={order.paymentStatus ?? 'pending'} />
        <StatusBadge status={order.fulfillmentStatus ?? 'unfulfilled'} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer + items */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-2 text-sm text-slate-600">{order.customerEmail ?? '—'}</p>
            {order.customerPhone && <p className="text-sm text-slate-600">{order.customerPhone}</p>}
            {(order.shippingName || addr) && (
              <div className="mt-3 text-sm text-slate-600">
                {order.shippingName && <div>{order.shippingName}</div>}
                {addr && (
                  <div>
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ''}
                    <br />
                    {addr.city}, {addr.state} {addr.postal_code} {addr.country}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Items</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {(order.items ?? []).map((it, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2">{it.productId}</td>
                    <td className="py-2 text-slate-500">× {it.quantity}</td>
                    <td className="py-2 text-right">{fmt(it.unitPrice * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{fmt(order.subtotal)}</dd></div>
              {!!order.discountTotal && (
                <div className="flex justify-between"><dt className="text-slate-500">Discount</dt><dd>−{fmt(order.discountTotal)}</dd></div>
              )}
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{fmt(order.grandTotal)}</dd></div>
              {!!order.refundedAmount && (
                <div className="flex justify-between text-red-600"><dt>Refunded</dt><dd>−{fmt(order.refundedAmount)}</dd></div>
              )}
            </dl>
          </div>
        </div>

        {/* Fulfillment + refund */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Fulfillment</h2>
            <div className="mt-3 space-y-3 text-sm">
              <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking number" className="w-full rounded border border-slate-300 px-3 py-2" />
              <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
                <option>USPS</option><option>UPS</option><option>FedEx</option><option>DHL</option>
              </select>
              <button disabled={shipping} className="w-full rounded bg-brand py-2 text-white disabled:opacity-50" onClick={markShipped}>
                {shipping ? 'Saving…' : 'Mark shipped'}
              </button>
              {shipMsg && <p className="text-xs text-slate-600">{shipMsg}</p>}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Refund</h2>
            {canRefund ? (
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-xs text-slate-500">Refundable balance: {fmt(refundable)}</p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">$</span>
                  <input
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="Full amount"
                    className="w-full rounded border border-slate-300 px-3 py-2"
                  />
                </div>
                <button disabled={refunding} className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700 disabled:opacity-50" onClick={refund}>
                  {refunding ? 'Processing…' : refundAmount.trim() ? `Refund $${refundAmount}` : 'Refund full amount'}
                </button>
                <p className="text-xs text-slate-400">Leave the amount blank for a full refund. Processed through Stripe.</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                {order.paymentStatus === 'refunded'
                  ? 'This order is fully refunded.'
                  : 'Refunds are available once the order is paid.'}
              </p>
            )}
            {refundMsg && <p className="mt-3 text-xs text-slate-600">{refundMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
