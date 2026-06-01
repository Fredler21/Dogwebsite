import type { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES } from '@/lib/mockProducts';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://allyoucanuse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now },
    { url: `${BASE}/shop`, lastModified: now },
    ...CATEGORIES.map(c => ({ url: `${BASE}/collections/${c.slug}`, lastModified: now })),
    ...PRODUCTS.map(p => ({ url: `${BASE}/products/${p.slug}`, lastModified: now }))
  ];
}
