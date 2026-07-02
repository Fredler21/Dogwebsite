import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { CATEGORIES, getProductsByCategory } from '@/lib/products';
import { notFound } from 'next/navigation';

// Revalidate live products at most once a minute (ISR).
export const revalidate = 60;

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find(c => c.slug === params.slug);
  if (!cat) return notFound();
  const products = await getProductsByCategory(params.slug);

  return (
    <main>
      {/* Collection banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {cat.image && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cat.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <nav className="text-xs text-white/70">
            <Link href="/" className="hover:text-white">Home</Link> /{' '}
            <Link href="/shop" className="hover:text-white">Shop</Link> / <span>{cat.name}</span>
          </nav>
          <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">{cat.name}</h1>
          <p className="mt-2 text-sm text-white/80">{products.length} products · Free shipping over $50</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {products.length === 0 ? (
          <p className="text-center text-slate-500">No products in this collection yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
