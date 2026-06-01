import Link from 'next/link';
const CATEGORIES = [
  { slug: 'tracking', title: 'Where is my order?', desc: 'Look up your tracking number.' },
  { slug: 'refund', title: 'Request a refund', desc: 'See our refund policy + open a request.' },
  { slug: 'damaged', title: 'Damaged item', desc: 'Get a replacement or refund.' },
  { slug: 'general', title: 'Other question', desc: 'Get in touch with our team.' }
];

export default function SupportCenter() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Support center</h1>
      <p className="mt-2 text-slate-600">Pick a topic and we will help fast.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/contact?category=${c.slug}`} className="rounded-lg border border-slate-200 bg-white p-6 hover:border-brand-accent">
            <div className="font-semibold">{c.title}</div>
            <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
