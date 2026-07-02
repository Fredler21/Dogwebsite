'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fbDb, fbStorage } from '@/lib/firebaseClient';
import { CATEGORIES } from '@/lib/mockProducts';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    categoryId: CATEGORIES[0]?.id ?? '',
    price: 0,
    compareAtPrice: 0,
    supplierCost: 0,
    shippingCost: 0,
    inventoryCount: 0,
    status: 'active' as 'active' | 'draft',
    imageUrls: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profit = form.price - form.supplierCost - form.shippingCost;
  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const effectiveSlug = form.slug || slugify(form.title);

  async function uploadImages(slug: string): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const r = storageRef(fbStorage(), `products/${slug}/${Date.now()}-${i}-${f.name}`);
      await uploadBytes(r, f);
      urls.push(await getDownloadURL(r));
    }
    return urls;
  }

  async function handleSave() {
    setError(null);
    const slug = effectiveSlug;
    if (!form.title.trim()) return setError('Title is required.');
    if (!slug) return setError('Slug is required.');
    if (form.price <= 0) return setError('Price must be greater than 0 (cents).');

    setSaving(true);
    try {
      const uploaded = files.length ? await uploadImages(slug) : [];
      const pasted = form.imageUrls
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const images = [...uploaded, ...pasted];
      if (images.length === 0) {
        setSaving(false);
        return setError('Add at least one image — upload a file or paste an image URL.');
      }

      const now = Date.now();
      const active = form.status === 'active';
      await addDoc(collection(fbDb(), 'products'), {
        title: form.title.trim(),
        slug,
        description: form.description.trim(),
        categoryId: form.categoryId,
        images,
        price: Math.round(form.price),
        ...(form.compareAtPrice > 0 ? { compareAtPrice: Math.round(form.compareAtPrice) } : {}),
        // `active` is what the Firestore security rules check for public reads.
        active,
        // `status` is the app-level lifecycle used by checkout + the admin list.
        status: form.status,
        // Inventory — checkout soft-checks these before creating a Stripe session.
        trackInventory: true,
        inventoryCount: Math.max(0, Math.round(form.inventoryCount)),
        stockStatus: form.inventoryCount > 0 ? 'in_stock' : 'out_of_stock',
        // Sourcing (admin-only, never shown to customers).
        costCents: Math.round(form.supplierCost),
        shippingCostCents: Math.round(form.shippingCost),
        vendor: 'Dogvanta',
        createdAt: now,
        updatedAt: now,
      });
      router.push('/admin/products');
    } catch (e) {
      const msg = (e as Error).message || 'Failed to save product.';
      setError(
        /permission|insufficient/i.test(msg)
          ? 'Permission denied. Your account needs the admin claim. Run the setAdminClaim function for your email (super-admin only), then sign out and back in.'
          : msg,
      );
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">New product</h1>
      <p className="mt-1 text-sm text-slate-500">
        Saved products with status <strong>Active</strong> appear in the storefront immediately.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            placeholder="No-Pull Padded Harness"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Slug (URL)</span>
          <input
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            placeholder={slugify(form.title) || 'auto-generated-from-title'}
          />
          <span className="mt-1 block text-xs text-slate-400">
            /products/{effectiveSlug || 'your-product'}
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value as 'active' | 'draft')}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="active">Active (visible in store)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="mt-1 h-24 w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Write for customers, not supplier-style text."
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          {(['price', 'compareAtPrice'] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm font-medium">
                {k === 'price' ? 'Price' : 'Compare-at price'} (cents)
              </span>
              <input
                type="number"
                value={form[k]}
                onChange={(e) => set(k, +e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </label>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(['supplierCost', 'shippingCost', 'inventoryCount'] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm font-medium">
                {k === 'supplierCost'
                  ? 'Supplier cost (cents)'
                  : k === 'shippingCost'
                  ? 'Shipping cost (cents)'
                  : 'Inventory count'}
              </span>
              <input
                type="number"
                value={form[k]}
                onChange={(e) => set(k, +e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </label>
          ))}
        </div>

        <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">
          Estimated profit: ${(profit / 100).toFixed(2)}
        </div>

        {/* Images */}
        <div className="rounded-lg border border-slate-200 p-4">
          <span className="text-sm font-medium">Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-2 block w-full text-sm"
          />
          {files.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">{files.length} file(s) selected for upload.</p>
          )}
          <label className="mt-3 block">
            <span className="text-xs text-slate-500">…or paste image URLs (one per line or comma-separated)</span>
            <textarea
              value={form.imageUrls}
              onChange={(e) => set('imageUrls', e.target.value)}
              className="mt-1 h-16 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://…/harness-front.jpg"
            />
          </label>
        </div>

        {error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="button"
          disabled={saving}
          className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50"
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </div>
    </div>
  );
}
