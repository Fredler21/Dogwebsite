import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/lib/mockProducts';

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 4);
  const bestSellers = PRODUCTS.slice(4, 8);
  return (
    <main>
      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Useful products, made for daily life.</h1>
            <p className="mt-4 text-slate-300">Car accessories selected for build quality, practical value, and honest shipping.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-md bg-brand-accent px-6 py-3 font-medium">Shop now</Link>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/hero/900/600" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">Featured</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map(c => (
            <Link key={c.id} href={`/collections/${c.slug}`} className="group block overflow-hidden rounded-lg bg-slate-100">
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-3 text-sm font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-bold">Best sellers</h2>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">{bestSellers.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </main>
  );
}
