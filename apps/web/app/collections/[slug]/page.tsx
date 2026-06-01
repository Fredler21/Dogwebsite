import { ProductCard } from '@/components/product/ProductCard';
import { CATEGORIES, productsByCategory } from '@/lib/mockProducts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = CATEGORIES.find(c => c.slug === params.slug);
  if (!cat) return notFound();
  const products = productsByCategory(params.slug);
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">{cat.name}</h1>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">{products.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </main>
  );
}
