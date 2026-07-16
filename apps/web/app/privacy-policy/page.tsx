import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Refined Paw collects, uses, and protects your personal information.'
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Privacy policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-slate-700">
        <p>Refined Paw (“we”, “us”) respects your privacy. This policy explains what we collect and how we use it. By using our site, you agree to the practices described here.</p>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Information we collect</h2>
          <p className="mt-2">We collect information you provide, such as your name, email, shipping address, and order details, along with information collected automatically, such as device and usage data via cookies and analytics.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">How we use your information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To process and ship your orders and provide customer support.</li>
            <li>To send order updates and, if you opt in, marketing emails.</li>
            <li>To improve our store, prevent fraud, and comply with legal obligations.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Payments</h2>
          <p className="mt-2">Payments are processed securely by Stripe. We do not store your full card details on our servers.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Sharing</h2>
          <p className="mt-2">We share data only with service providers who help us operate (payment, shipping, email, analytics), and only as needed. We never sell your personal information.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Your rights</h2>
          <p className="mt-2">You may request access to, correction of, or deletion of your personal data, and you can unsubscribe from marketing at any time. To make a request, <a href="/contact" className="font-semibold text-brand hover:underline">contact us</a>.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-ink">Cookies</h2>
          <p className="mt-2">We use cookies for essential site functions and, with your consent, analytics and advertising. You can manage preferences through the consent banner or your browser settings.</p>
        </section>
      </div>
    </main>
  );
}
