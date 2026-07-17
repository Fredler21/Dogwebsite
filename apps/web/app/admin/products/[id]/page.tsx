'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fbDb, fbStorage } from '@/lib/firebaseClient';
import { CATEGORIES } from '@/lib/mockProducts';

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
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
    status: 'draft' as 'active' | 'draft',
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [pastedUrls, setPastedUrls] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const profit = form.price - form.supplierCost - form.shippingCost;

  const load = useCallback(async () => {
    try {
      const snap = await getDoc(doc(fbDb(), 'products', params.id));
      if (!snap.exists()) {
        setNotFound(true);
        return;
      }
      const d = snap.data() as Record<string, unknown>;
      setForm({
        title: (d.title as string) ?? '',
        slug: (d.slug as string) ?? '',
        description: (d.description as string) ?? '',
        categoryId: (d.categoryId as string) ?? CATEGORIES[0]?.id ?? '',
        price: (d.price as number) ?? 0,
        compareAtPrice: (d.compareAtPrice as number) ?? 0,
        supplierCost: (d.costCents as number) ?? 0,
        shippingCost: (d.shippingCostCents as number) ?? 0,
        inventoryCount: (d.inventoryCount as number) ?? 0,
        status: ((d.status as string) === 'active' ? 'active' : 'draft'),
      });
      setExistingImages(Array.isArray(d.images) ? (d.images as string[]) : []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function uploadNewImages(slug: string): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const r = storageRef(fbStorage(), `products/${slug || params.id}/${Date.now()}-${i}-${f.name}`);
      await uploadBytes(r, f);
      urls.push(await getDownloadURL(r));
    }
    return urls;
  }

  async function handleSave() {
    setError(null);
    setSaved(false);
    const slug = form.slug || slugify(form.title);
    if (!form.title.trim()) return setError('Title is required.');
    if (form.price <= 0) return setError('Price must be greater than 0 (cents).');

    setSaving(true);
    try {
      const uploaded = files.length ? await uploadNewImages(slug) : [];
      const pasted = pastedUrls.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      const images = [...existingImages, ...uploaded, ...pasted];
      if (form.status === 'active' && images.length === 0) {
        setSaving(false);
        return setError('Add at least one photo before setting this product Active.');
      }

      await updateDoc(doc(fbDb(), 'products', params.id), {
        title: form.title.trim(),
        slug,
        description: form.description.trim(),
        categoryId: form.categoryId,
        images,
        price: Math.round(form.price),
        compareAtPrice: form.compareAtPrice > 0 ? Math.round(form.compareAtPrice) : 0,
        active: form.status === 'active',
        status: form.status,
        trackInventory: true,
        inventoryCount: Math.max(0, Math.round(form.inventoryCount)),
        stockStatus: form.inventoryCount > 0 ? 'in_stock' : 'out_of_stock',
        costCents: Math.round(form.supplierCost),
        shippingCostCents: Math.round(form.shippingCost),
        updatedAt: Date.now(),
      });
      setFiles([]);
      setPastedUrls('');
      setExistingImages(images);
      setSaved(true);
    } catch (e) {
      const msg = (e as Error).message || 'Failed to save.';
      setError(/permission|insufficient/i.test(msg) ? 'Permission denied. Your account needs the admin claim.' : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this product permanently? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(fbDb(), 'products', params.id));
      router.push('/admin/products');
    } catch (e) {
      setError((e as Error).message);
      setDeleting(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (notFound) return <p className="text-sm text-red-600">Product not found.</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit product</h1>
        <a href="/admin/products" className="text-sm text-brand-accent underline">← All products</a>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Add photos, adjust pricing, and set <strong>Active</strong> to put it in the storefront.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Status</span>
            <select value={form.status} onChange={(e) => set('status', e.target.value as 'active' | 'draft')} className="mt-1 w-full rounded border border-slate-300 px-3 py-2">
              <option value="active">Active (visible in store)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="mt-1 h-24 w-full rounded border border-slate-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          {(['price', 'compareAtPrice'] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm font-medium">{k === 'price' ? 'Price' : 'Compare-at price'} (cents)</span>
              <input type="number" value={form[k] === 0 ? '' : form[k]} onChange={(e) => set(k, e.target.value === '' ? 0 : +e.target.value)} min="0" placeholder="0" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(['supplierCost', 'shippingCost', 'inventoryCount'] as const).map((k) => (
            <label key={k} className="block">
              <span className="text-sm font-medium">{k === 'supplierCost' ? 'Supplier cost (cents)' : k === 'shippingCost' ? 'Shipping cost (cents)' : 'Inventory count'}</span>
              <input type="number" value={form[k] === 0 ? '' : form[k]} onChange={(e) => set(k, e.target.value === '' ? 0 : +e.target.value)} min="0" placeholder="0" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
          ))}
        </div>

        <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">Estimated profit: ${(profit / 100).toFixed(2)}</div>

        {/* Images */}
        <div className="rounded-lg border border-slate-200 p-4">
          <span className="text-sm font-medium">Photos</span>
          {existingImages.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((url, i) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-20 w-20 rounded border border-slate-200 object-cover" />
                  <button
                    type="button"
                    onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                    aria-label="Remove photo"
                  >×</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-amber-700">No photo yet. Add one below before setting this Active.</p>
          )}
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="mt-3 block w-full text-sm" />
          {files.length > 0 && <p className="mt-1 text-xs text-slate-500">{files.length} new file(s) to upload on save.</p>}
          <label className="mt-3 block">
            <span className="text-xs text-slate-500">…or paste image URLs (one per line or comma-separated)</span>
            <textarea value={pastedUrls} onChange={(e) => setPastedUrls(e.target.value)} className="mt-1 h-16 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="https://…/product.jpg" />
          </label>
        </div>

        {error && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {saved && <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">Saved.</div>}

        <div className="flex items-center gap-3">
          <button type="button" disabled={saving} className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50" onClick={handleSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" disabled={deleting} className="rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50" onClick={handleDelete}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
