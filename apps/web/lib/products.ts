import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { fbDb } from './firebaseClient';
import type { Category, Product } from './types';
import { PRODUCTS as DEMO_PRODUCTS, CATEGORIES } from './mockProducts';

// Categories are a fixed store taxonomy, so they stay static and importable
// from one place. Products, however, are now read live from Firestore.
export { CATEGORIES };
export const getCategory = (idOrSlug: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === idOrSlug || c.slug === idOrSlug);

// If Firebase isn't configured (e.g. local/CI build with no env), skip the
// network call entirely and serve the built-in demo catalogue.
const firebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

function mapDoc(id: string, d: Record<string, unknown>): Product {
  const images = Array.isArray(d.images) && d.images.length
    ? (d.images as string[])
    : ['https://placedog.net/800/800?id=1'];
  return {
    id,
    title: (d.title as string) ?? 'Untitled',
    slug: (d.slug as string) ?? id,
    description: (d.description as string) ?? '',
    categoryId: (d.categoryId as string) ?? '',
    images,
    price: (d.price as number) ?? 0,
    compareAtPrice: (d.compareAtPrice as number) || undefined,
    status: (d.status as Product['status']) ?? 'active',
    vendor: (d.vendor as string) || undefined,
    rating: (d.rating as number) ?? undefined,
    reviewCount: (d.reviewCount as number) ?? undefined,
    badge: (d.badge as string) || undefined,
    benefits: (d.benefits as string[]) ?? undefined,
    whatsIncluded: (d.whatsIncluded as string[]) ?? undefined,
    faq: (d.faq as { q: string; a: string }[]) ?? undefined,
  };
}

/**
 * All publicly-visible products, newest first.
 *
 * Reads `/products` filtered by `active == true` (the field the Firestore
 * security rules gate public reads on) and sorts client-side to avoid needing
 * a composite index. Falls back to the built-in demo catalogue when Firebase
 * is unconfigured, unreachable, or has no live products yet — so the storefront
 * is never empty while you're still adding your first real products.
 */
export async function getProducts(): Promise<Product[]> {
  if (!firebaseConfigured) return DEMO_PRODUCTS;
  try {
    const snap = await getDocs(
      query(collection(fbDb(), 'products'), where('active', '==', true), limit(200)),
    );
    if (snap.empty) return DEMO_PRODUCTS;
    return snap.docs
      .slice()
      .sort((a, b) => ((b.data().createdAt as number) ?? 0) - ((a.data().createdAt as number) ?? 0))
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    // Network error / rules misconfig: never break the storefront.
    return DEMO_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(catSlugOrId: string): Promise<Product[]> {
  const cat = getCategory(catSlugOrId);
  if (!cat) return [];
  const all = await getProducts();
  return all.filter((p) => p.categoryId === cat.id);
}
