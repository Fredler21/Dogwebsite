import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'The terms and conditions for shopping with Dogvanta.'
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Terms of service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-slate-700">
        <p>Welcome to Dogvanta. By accessing or purchasing from our store, you agree to these terms. Please read them carefully.</p>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Orders & pricing</h2>
          <p className="mt-2">All prices are listed in USD and may change without notice. We reserve the right to refuse or cancel any order, including for pricing errors or suspected fraud. A confirmed order forms a contract once payment is accepted.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Products</h2>
          <p className="mt-2">We work to display products and colors accurately, but cannot guarantee your screen shows them perfectly. Always follow sizing guidance and use products as intended, with supervision where appropriate.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Shipping, returns & refunds</h2>
          <p className="mt-2">Delivery, returns, and refunds are governed by our <a href="/shipping-policy" className="font-semibold text-brand hover:underline">Shipping</a> and <a href="/return-policy" className="font-semibold text-brand hover:underline">Return</a> policies, which form part of these terms.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Intellectual property</h2>
          <p className="mt-2">All content on this site — logos, text, and images — is owned by Dogvanta or its licensors and may not be reused without permission.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Limitation of liability</h2>
          <p className="mt-2">To the extent permitted by law, Dogvanta is not liable for indirect or consequential damages arising from use of our products or site. Nothing in these terms limits rights you have under applicable consumer law.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Contact</h2>
          <p className="mt-2">Questions about these terms? <a href="/contact" className="font-semibold text-brand hover:underline">Get in touch</a> and we’ll be happy to help.</p>
        </section>
      </div>
    </main>
  );
}
