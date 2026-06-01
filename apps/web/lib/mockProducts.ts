import type { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'interior', name: 'Interior Accessories', slug: 'interior-accessories', image: 'https://picsum.photos/seed/cat1/600/400' },
  { id: 'cleaning', name: 'Cleaning Tools', slug: 'cleaning-tools', image: 'https://picsum.photos/seed/cat2/600/400' },
  { id: 'phone', name: 'Phone Holders', slug: 'phone-holders', image: 'https://picsum.photos/seed/cat3/600/400' },
  { id: 'storage', name: 'Storage & Organization', slug: 'storage-organization', image: 'https://picsum.photos/seed/cat4/600/400' },
  { id: 'comfort', name: 'Comfort Accessories', slug: 'comfort-accessories', image: 'https://picsum.photos/seed/cat5/600/400' }
];

function p(i: number, title: string, categoryId: string, price: number, compareAt?: number): Product {
  return {
    id: `p${i}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    description: `${title} — built for daily use. Premium materials, easy install.`,
    categoryId,
    images: [`https://picsum.photos/seed/p${i}/800/800`, `https://picsum.photos/seed/p${i}b/800/800`],
    price,
    compareAtPrice: compareAt,
    status: 'active',
    benefits: ['Easy install', 'Durable build', 'Universal fit'],
    whatsIncluded: ['1x main unit', 'Mounting hardware', 'Quick start guide'],
    faq: [
      { q: 'Does it fit my car?', a: 'Universal fit for most vehicles.' },
      { q: 'How long does shipping take?', a: 'See our shipping policy.' }
    ]
  };
}

export const PRODUCTS: Product[] = [
  p(1, '360 Dashboard Phone Holder', 'phone', 1999, 2999),
  p(2, 'Magnetic Air Vent Mount', 'phone', 1499, 2299),
  p(3, 'Wireless Charging Car Mount', 'phone', 3499, 4999),
  p(4, 'Backseat Tablet Holder', 'phone', 2499),
  p(5, 'Microfiber Detailing Cloth Pack', 'cleaning', 1299, 1999),
  p(6, 'Foam Cannon Car Wash Kit', 'cleaning', 3999, 5499),
  p(7, 'Mini Vacuum Cleaner USB', 'cleaning', 2999, 4499),
  p(8, 'Dashboard Slime Cleaner', 'cleaning', 899),
  p(9, 'Trunk Organizer Box', 'storage', 3299, 4599),
  p(10, 'Backseat Storage Net', 'storage', 1199, 1999),
  p(11, 'Headrest Hook Set', 'storage', 799, 1299),
  p(12, 'Console Side Pocket', 'storage', 1499),
  p(13, 'Memory Foam Seat Cushion', 'comfort', 3499, 4999),
  p(14, 'Lumbar Support Pillow', 'comfort', 2999, 3999),
  p(15, 'Heated Seat Cover', 'comfort', 4999, 6999),
  p(16, 'Steering Wheel Cover Premium', 'interior', 1899, 2599),
  p(17, 'LED Interior Light Strip', 'interior', 2299, 3299),
  p(18, 'Car Floor Mat Set Universal', 'interior', 4499, 5999),
  p(19, 'Dashboard Anti-Slip Pad', 'interior', 899),
  p(20, 'Sun Shade Windshield Cover', 'interior', 1799, 2499)
];

export const findProduct = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const productsByCategory = (catSlug: string) => {
  const cat = CATEGORIES.find(c => c.slug === catSlug);
  return cat ? PRODUCTS.filter(p => p.categoryId === cat.id) : [];
};
