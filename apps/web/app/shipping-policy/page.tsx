import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping policy',
  description: 'How and when Dogvanta ships your order, including processing times, rates, and tracking.'
};

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Shipping policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-slate-700">
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Processing time</h2>
          <p className="mt-2">Orders are processed within 1 to 2 business days. Orders placed on weekends or holidays are processed the next business day.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Delivery time & rates</h2>
          <p className="mt-2">Standard delivery typically takes 3 to 7 business days after processing. Shipping is <strong>free on orders over $50</strong>; a flat rate is calculated at checkout for smaller orders. Exact rates and estimated delivery dates are shown before you pay.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Tracking</h2>
          <p className="mt-2">As soon as your order ships, we email you a tracking link. You can also check status any time on our <a href="/track-order" className="font-semibold text-brand hover:underline">Track order</a> page.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">International orders</h2>
          <p className="mt-2">We ship to most countries. International delivery times vary by destination. Any customs duties or import taxes are the responsibility of the recipient and are shown at checkout where possible.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Lost or delayed packages</h2>
          <p className="mt-2">If your order hasn’t arrived within the estimated window, <a href="/contact" className="font-semibold text-brand hover:underline">contact us</a> and we’ll track it down or send a replacement.</p>
        </section>
      </div>
    </main>
  );
}
