import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about shipping, returns, sizing, and orders at Dogvanta.'
};

const FAQ: { section: string; items: { q: string; a: string }[] }[] = [
  {
    section: 'Shipping & delivery',
    items: [
      { q: 'How long does shipping take?', a: 'Orders are processed within 1 to 2 business days and typically arrive in 3 to 7 business days. You’ll get a tracking link by email as soon as it ships.' },
      { q: 'Do you offer free shipping?', a: 'Yes, shipping is free on all orders over $50. Below that, a flat rate is calculated at checkout.' },
      { q: 'Do you ship internationally?', a: 'We ship to most countries. International delivery times and any duties are shown at checkout.' }
    ]
  },
  {
    section: 'Returns & guarantee',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day happiness guarantee. If you or your dog aren’t happy, contact us within 30 days for a replacement or refund.' },
      { q: 'How do I start a return?', a: 'Head to our contact page with your order number and we’ll email you a prepaid label and next steps.' }
    ]
  },
  {
    section: 'Products & sizing',
    items: [
      { q: 'How do I choose the right size?', a: 'Every product page includes a sizing chart. Measure your dog’s girth, neck, or length as noted and pick the matching size.' },
      { q: 'Are your products safe?', a: 'Yes, all products use non-toxic, pet-safe materials and are reviewed with our veterinary partners before we stock them.' }
    ]
  },
  {
    section: 'Orders & payment',
    items: [
      { q: 'How can I track my order?', a: 'Use the Track order page with your order number, or the tracking link in your shipping confirmation email.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major cards, PayPal, Apple Pay, and Google Pay. Payments are securely processed by Stripe.' }
    ]
  }
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-4xl font-bold">Frequently asked questions</h1>
      <p className="mt-2 text-slate-500">Can’t find what you’re looking for? <Link href="/contact" className="font-semibold text-brand hover:underline">Contact us</Link>.</p>

      <div className="mt-10 space-y-10">
        {FAQ.map(group => (
          <section key={group.section}>
            <h2 className="font-display text-xl font-bold text-ink">{group.section}</h2>
            <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
              {group.items.map(item => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink">
                    {item.q}<span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
