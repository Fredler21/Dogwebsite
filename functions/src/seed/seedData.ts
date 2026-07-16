import { db } from '../lib/admin';

// Idempotent seed: writes 5 categories + 20 sample car-accessory products.
// Run from emulator or one-off Cloud Run task.
export async function seed(): Promise<void> {
  const now = Date.now();
  const categories = [
    { id: 'interior', name: 'Interior Accessories', slug: 'interior-accessories', sortOrder: 1, status: 'active' },
    { id: 'cleaning', name: 'Cleaning Tools', slug: 'cleaning-tools', sortOrder: 2, status: 'active' },
    { id: 'phone', name: 'Phone Holders', slug: 'phone-holders', sortOrder: 3, status: 'active' },
    { id: 'storage', name: 'Storage & Organization', slug: 'storage-organization', sortOrder: 4, status: 'active' },
    { id: 'comfort', name: 'Comfort Accessories', slug: 'comfort-accessories', sortOrder: 5, status: 'active' }
  ];
  for (const c of categories) await db.collection('categories').doc(c.id).set(c, { merge: true });

  for (let i = 1; i <= 20; i++) {
    const id = `p${i}`;
    await db.collection('products').doc(id).set({
      title: `Sample Product ${i}`,
      slug: `sample-product-${i}`,
      description: 'Replace with real copy.',
      categoryId: categories[(i - 1) % categories.length].id,
      images: [`https://picsum.photos/seed/${id}/800/800`],
      price: 1000 + i * 200,
      status: 'active',
      stockStatus: 'in_stock',
      createdAt: now,
      updatedAt: now
    }, { merge: true });
  }

  await db.collection('suppliers').doc('sup_default').set({
    name: 'Default Supplier', apiType: 'none', status: 'active',
    averageShippingDays: 7, rating: 4.2, createdAt: now, updatedAt: now
  }, { merge: true });

  await db.collection('settings').doc('public').set({
    storeName: 'Refined Paw', supportEmail: 'support@refinedpaw.com', currency: 'USD'
  }, { merge: true });
  await db.collection('settings').doc('store').set({
    aiAutomationLevel: 'manual', shippingPolicyVersion: '1.0', returnPolicyVersion: '1.0'
  }, { merge: true });
}
