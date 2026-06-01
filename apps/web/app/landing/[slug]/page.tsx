import { notFound } from 'next/navigation';

/**
 * Landing pages stored at /landingPages/{slug} with shape:
 * { slug, title, heroHeading, heroSub, heroImageUrl, productIds[], ctaText, ctaUrl, published, updatedAt }
 *
 * This file fetches from Firestore via the Admin SDK at build/request time
 * once auth wiring lands. For now we render from a static stub so the route exists.
 */

interface Params { params: { slug: string }; }

const STUB: Record<string, { title: string; heroHeading: string; heroSub: string; ctaText: string }> = {
  'spring-sale': {
    title: 'Spring Sale',
    heroHeading: '25% off everything for the road',
    heroSub: 'Three days only — refresh your ride.',
    ctaText: 'Shop the sale'
  }
};

export default function LandingPage({ params }: Params) {
  const data = STUB[params.slug];
  if (!data) notFound();
  return (
    <main>
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="text-4xl font-bold sm:text-6xl">{data.heroHeading}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{data.heroSub}</p>
          <a href="/shop" className="mt-8 inline-block rounded bg-brand-accent px-6 py-3 font-semibold text-white">{data.ctaText}</a>
        </div>
      </section>
    </main>
  );
}
