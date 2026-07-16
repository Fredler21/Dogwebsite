import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About us',
  description: 'Refined Paw is on a mission to make thoughtfully made, vet-approved dog gear accessible to every dog parent.'
};

const VALUES = [
  { icon: '🐕', title: 'Dogs first', text: 'Every product is chosen to make a real dog’s life better, not to hit a price point.' },
  { icon: '🔬', title: 'Vet-approved', text: 'We review materials and safety with veterinary partners before anything ships.' },
  { icon: '🌍', title: 'Honest sourcing', text: 'We vet every supplier for quality and ethics, and price fairly.' }
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-brand to-emerald-900 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Built by dog people, for dog people</h1>
          <p className="mt-4 text-lg text-white/80">
            Refined Paw started with a simple frustration: too much overpriced, low-quality dog gear that didn’t last a week.
            So we built a store that only stocks things we’d give our own dogs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {VALUES.map(v => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="text-3xl">{v.icon}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://placedog.net/800/600?id=210" alt="Happy dogs" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Our promise</h2>
            <p className="mt-3 text-slate-600">
              We stand behind everything we sell with a 30-day happiness guarantee. If your dog doesn’t love it,
              we’ll make it right, with no drama and no fine print. Fast, tracked shipping and real humans on support are
              the baseline, not the upsell.
            </p>
            <Link href="/shop" className="btn-primary mt-6">Shop the collection</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
