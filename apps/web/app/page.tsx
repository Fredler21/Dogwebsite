import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, CATEGORIES } from '@/lib/products';

// Re-fetch live products at most once a minute (ISR) so newly added products
// appear without a redeploy, while keeping the page fast and cacheable.
export const revalidate = 60;

const TRUST = [
  { icon: '🚚', title: 'Free shipping', sub: 'On orders over $50' },
  { icon: '↩️', title: '30-day returns', sub: 'Happiness guaranteed' },
  { icon: '🔒', title: 'Secure checkout', sub: 'Powered by Stripe' },
  { icon: '💬', title: 'Real support', sub: 'Reply within 1 day' }
];

const REVIEWS = [
  { name: 'Jessica M.', text: 'My Golden destroys every toy, but the chew bone has lasted 3 months. Finally!', pet: 'Golden Retriever' },
  { name: 'Andre P.', text: 'The orthopedic bed changed my senior dog’s life. He actually sleeps through the night now.', pet: 'Labrador, 11 yrs' },
  { name: 'Priya K.', text: 'No-pull harness is a game changer on walks. Ordered one for each of my two pups.', pet: 'Beagles x2' }
];

export default async function HomePage() {
  const PRODUCTS = await getProducts();
  // Best sellers by badge; fall back to the newest products so the grid is
  // never empty once you've added real products without badges.
  const flagged = PRODUCTS.filter(p => p.badge === 'Best seller');
  const bestSellers = (flagged.length ? flagged : PRODUCTS).slice(0, 4);
  // "New arrivals" — the next batch, with no overlap with the best sellers above.
  const featured = PRODUCTS.slice(4, 8);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand to-emerald-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
              🐾 New season drop is here
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Everything your dog loves, delivered.
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/80">
              Thoughtfully designed toys, beds, and walking gear. Vet-approved, dog-tested, and backed by our 30-day happiness guarantee.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-accent">Shop best sellers</Link>
              <Link href="/collections/toys" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Browse toys
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/80">
              <span className="text-brand-accent">★★★★★</span>
              <span>Loved by 25,000+ dog parents</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://placedog.net/1000/750?id=200" alt="A happy dog with Refined Paw gear" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 text-ink shadow-xl sm:block">
              <div className="text-2xl font-extrabold text-brand">30-day</div>
              <div className="text-xs text-slate-500">happiness guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
          {TRUST.map(t => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden>{t.icon}</span>
              <div>
                <div className="text-sm font-semibold text-ink">{t.title}</div>
                <div className="text-xs text-slate-500">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Shop by category</h2>
          <Link href="/shop" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(c => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="group relative block overflow-hidden rounded-2xl">
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Most loved</span>
            <h2 className="font-display text-3xl font-bold">Best sellers</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-brand hover:underline">Shop all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {bestSellers.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto mt-14 max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-brand-accent px-8 py-12 text-ink md:px-14 md:py-16">
          <div className="relative z-10 max-w-lg">
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">Summer sale: up to 40% off</h2>
            <p className="mt-3 text-ink/80">Stock up on the season’s essentials. Limited-time savings across toys, beds, and travel gear.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Shop the sale
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / new arrivals */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Just in</span>
            <h2 className="font-display text-3xl font-bold">New arrivals</h2>
          </div>
          <Link href="/collections/walking-gear" className="text-sm font-semibold text-brand hover:underline">See more →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {featured.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl font-bold">Dog parents love us</h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="text-brand-accent">★★★★★</span> 4.8/5 from 12,000+ verified reviews
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REVIEWS.map(r => (
              <figure key={r.name} className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-card">
                <div className="text-brand-accent">★★★★★</div>
                <blockquote className="mt-3 text-sm text-slate-700">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-ink">
                  {r.name} <span className="font-normal text-slate-400">· {r.pet}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
