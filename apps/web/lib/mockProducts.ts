import type { Category, Product } from './types';

// Deterministic dog photos so the demo store always looks like a real pet shop.
const dog = (id: number, size = 800) => `https://placedog.net/${size}/${size}?id=${id}`;

export const CATEGORIES: Category[] = [
  { id: 'toys', name: 'Toys & Enrichment', slug: 'toys', image: dog(12, 600) },
  { id: 'beds', name: 'Beds & Comfort', slug: 'beds', image: dog(25, 600) },
  { id: 'walking', name: 'Walking Gear', slug: 'walking-gear', image: dog(38, 600) },
  { id: 'grooming', name: 'Grooming & Care', slug: 'grooming', image: dog(52, 600) },
  { id: 'feeding', name: 'Bowls & Feeding', slug: 'feeding', image: dog(64, 600) },
  { id: 'travel', name: 'Travel & Outdoor', slug: 'travel', image: dog(77, 600) }
];

// Per-category copy so product detail pages read like a real dog store, not a car shop.
const CATEGORY_COPY: Record<string, { benefits: string[]; included: string[]; faq: { q: string; a: string }[] }> = {
  toys: {
    benefits: ['Vet-approved, non-toxic materials', 'Built to survive enthusiastic chewers', 'Keeps dogs mentally stimulated'],
    included: ['1x toy', 'Care & sizing guide'],
    faq: [
      { q: 'Is it safe for aggressive chewers?', a: 'Yes — made from tough, pet-safe materials. Always supervise play and replace when worn.' },
      { q: 'What size should I choose?', a: 'Pick by your dog’s weight — sizing is on each product image and in the guide.' }
    ]
  },
  beds: {
    benefits: ['Orthopedic support for joints & hips', 'Machine-washable removable cover', 'Non-slip base stays put'],
    included: ['1x bed', 'Removable washable cover'],
    faq: [
      { q: 'How do I clean it?', a: 'Unzip the cover and machine wash cold, tumble dry low. The foam core wipes clean.' },
      { q: 'Which size fits my dog?', a: 'Measure your dog nose-to-tail and add 8 in. Size chart is in the product images.' }
    ]
  },
  walking: {
    benefits: ['No-pull design protects the neck', 'Reflective stitching for night walks', 'Adjustable, secure fit'],
    included: ['1x harness/collar', 'Quick-fit sizing card'],
    faq: [
      { q: 'How do I measure for the right fit?', a: 'Measure the girth just behind the front legs and the neck. Full chart is on the images.' },
      { q: 'Is it good for pullers?', a: 'Yes — the front-clip design gently discourages pulling without choking.' }
    ]
  },
  grooming: {
    benefits: ['Gentle on skin and coat', 'Reduces shedding around the home', 'Easy to clean and store'],
    included: ['1x grooming tool', 'Usage tips card'],
    faq: [
      { q: 'How often should I use it?', a: '2–3 times a week keeps most coats healthy and shed-free.' },
      { q: 'Does it work on all coat types?', a: 'Yes — suitable for short, medium and long double coats.' }
    ]
  },
  feeding: {
    benefits: ['Slows fast eaters to aid digestion', 'Food-grade, BPA-free materials', 'Dishwasher safe'],
    included: ['1x feeder/bowl', 'Non-slip base'],
    faq: [
      { q: 'Is it dishwasher safe?', a: 'Yes — top-rack dishwasher safe, or hand wash with warm soapy water.' },
      { q: 'Will it help my gulper?', a: 'The maze design can slow eating by up to 10x, reducing bloat and vomiting.' }
    ]
  },
  travel: {
    benefits: ['Leak-proof and one-hand operated', 'Lightweight for hikes and road trips', 'Durable, pet-safe build'],
    included: ['1x travel accessory', 'Carry clip'],
    faq: [
      { q: 'Is it easy to carry on walks?', a: 'Yes — it clips to a bag or belt and weighs next to nothing.' },
      { q: 'How do I clean it?', a: 'Rinse with warm water after each trip; parts separate for a deeper clean.' }
    ]
  }
};

interface Seed {
  title: string;
  cat: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: string;
  vendor?: string;
}

function build(i: number, s: Seed): Product {
  const copy = CATEGORY_COPY[s.cat];
  return {
    id: `p${i}`,
    title: s.title,
    slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    description: `${s.title} — thoughtfully designed for happy, healthy dogs. Durable, dog-safe materials, tested by real pups, and backed by our 30-day happiness guarantee.`,
    categoryId: s.cat,
    images: [dog(i + 100), dog(i + 130)],
    price: s.price,
    compareAtPrice: s.compareAt,
    status: 'active',
    vendor: s.vendor ?? 'Refined Paw',
    rating: s.rating,
    reviewCount: s.reviews,
    badge: s.badge,
    benefits: copy.benefits,
    whatsIncluded: copy.included,
    faq: copy.faq
  };
}

const SEEDS: Seed[] = [
  // Toys & Enrichment
  { title: 'Indestructible Chew Bone', cat: 'toys', price: 1899, compareAt: 2999, rating: 4.8, reviews: 1243, badge: 'Best seller' },
  { title: 'Squeaky Plush Duck', cat: 'toys', price: 1299, compareAt: 1899, rating: 4.7, reviews: 862 },
  { title: 'Interactive Treat Puzzle', cat: 'toys', price: 2499, compareAt: 3499, rating: 4.9, reviews: 517, badge: 'Staff pick' },
  { title: 'Rope Tug Toy 3-Pack', cat: 'toys', price: 1599, rating: 4.6, reviews: 1094 },
  // Beds & Comfort
  { title: 'Orthopedic Memory Foam Dog Bed', cat: 'beds', price: 6999, compareAt: 9999, rating: 4.9, reviews: 2310, badge: 'Best seller' },
  { title: 'Calming Donut Cuddler Bed', cat: 'beds', price: 4499, compareAt: 6499, rating: 4.8, reviews: 1877 },
  { title: 'Cooling Gel Pet Mat', cat: 'beds', price: 3299, compareAt: 4499, rating: 4.5, reviews: 604 },
  { title: 'Elevated Cot Bed', cat: 'beds', price: 5499, rating: 4.7, reviews: 431 },
  // Walking Gear
  { title: 'No-Pull Padded Harness', cat: 'walking', price: 3299, compareAt: 4499, rating: 4.8, reviews: 3120, badge: 'Best seller' },
  { title: 'Reflective LED Dog Collar', cat: 'walking', price: 1999, compareAt: 2999, rating: 4.6, reviews: 988 },
  { title: 'Hands-Free Bungee Leash', cat: 'walking', price: 2499, rating: 4.7, reviews: 742 },
  { title: 'Waterproof Tactical Leash', cat: 'walking', price: 2899, compareAt: 3799, rating: 4.7, reviews: 356 },
  // Grooming & Care
  { title: 'Self-Cleaning Slicker Brush', cat: 'grooming', price: 1799, compareAt: 2599, rating: 4.8, reviews: 2664, badge: 'New' },
  { title: 'Deshedding Grooming Glove', cat: 'grooming', price: 1499, rating: 4.5, reviews: 1210 },
  { title: 'Oatmeal Soothing Shampoo', cat: 'grooming', price: 1699, compareAt: 2199, rating: 4.9, reviews: 803 },
  { title: 'Dog Nail Grinder Kit', cat: 'grooming', price: 2599, compareAt: 3499, rating: 4.6, reviews: 655 },
  // Bowls & Feeding
  { title: 'Slow-Feeder Anti-Gulp Bowl', cat: 'feeding', price: 1599, compareAt: 2299, rating: 4.7, reviews: 1533, badge: 'Best seller' },
  { title: 'Elevated Double Diner Stand', cat: 'feeding', price: 3799, rating: 4.6, reviews: 489 },
  // Travel & Outdoor
  { title: 'Foldable Travel Water Bottle', cat: 'travel', price: 1899, compareAt: 2699, rating: 4.8, reviews: 1076, badge: 'New' },
  { title: 'Backseat Car Hammock Cover', cat: 'travel', price: 4299, compareAt: 5999, rating: 4.7, reviews: 921 }
];

export const PRODUCTS: Product[] = SEEDS.map((s, idx) => build(idx + 1, s));

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const productsByCategory = (catSlug: string) => {
  const cat = CATEGORIES.find(c => c.slug === catSlug);
  return cat ? PRODUCTS.filter(p => p.categoryId === cat.id) : [];
};
