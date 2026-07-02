import type { MetadataRoute } from 'next';
import { getProducts, CATEGORIES } from '@/lib/products';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dogvanta.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getProducts();
  return [
    { url: BASE, lastModified: now },
    { url: `${BASE}/shop`, lastModified: now },
    ...CATEGORIES.map(c => ({ url: `${BASE}/collections/${c.slug}`, lastModified: now })),
    ...products.map(p => ({ url: `${BASE}/products/${p.slug}`, lastModified: now }))
  ];
}
