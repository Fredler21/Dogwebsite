import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return policy',
  description: 'Dogvanta’s 30-day happiness guarantee — how returns, replacements, and refunds work.'
};

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Return policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-slate-700">
        <section>
          <h2 className="font-display text-xl font-bold text-ink">30-day happiness guarantee</h2>
          <p className="mt-2">If you or your dog aren’t happy with a purchase, you have <strong>30 days from delivery</strong> to request a replacement or refund. We want every order to be a great experience.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">How to start a return</h2>
          <p className="mt-2">Visit our <a href="/contact" className="font-semibold text-brand hover:underline">contact page</a> with your order number and reason for return. We’ll reply within one business day with a prepaid shipping label and instructions.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Condition of returns</h2>
          <p className="mt-2">Items should be in resellable condition where possible. For hygiene and safety reasons, some used consumables (like opened shampoo or heavily chewed toys) may only qualify for a replacement rather than a resale return — but if a product failed, we’ll make it right regardless.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Refunds</h2>
          <p className="mt-2">Once your return is received or the issue is confirmed, refunds are issued to your original payment method within 5–10 business days. Original shipping costs are non-refundable unless the return is due to our error.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Damaged or wrong items</h2>
          <p className="mt-2">Received something damaged or incorrect? Contact us within 30 days with a photo and we’ll send a free replacement right away.</p>
        </section>
      </div>
    </main>
  );
}
