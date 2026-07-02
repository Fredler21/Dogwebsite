'use client';
import { useState } from 'react';

const PLATFORMS = [
  { v: 'alibaba', l: 'Alibaba' },
  { v: 'aliexpress', l: 'AliExpress' },
  { v: 'cjdropshipping', l: 'CJ Dropshipping' },
  { v: 'private', l: 'Private supplier' },
  { v: 'other', l: 'Other' }
];
const INCOTERMS = ['', 'EXW', 'FOB', 'CIF', 'DDP', 'DAP'];
const CHAT_CHANNELS = ['', 'wechat', 'whatsapp', 'alibaba', 'skype', 'email'];
const CERT_OPTIONS = ['CE','FDA','FCC','ISO9001','ISO14001','REACH','CPSIA','RoHS','UL','BSCI','SEDEX'];

export default function NewSupplier() {
  const [form, setForm] = useState({
    // Required
    name: '', contactEmail: '', platform: 'alibaba', defaultLeadTimeDays: 14,
    // Identity
    contactName: '', legalEntityName: '', businessLicenseNumber: '',
    phone: '', chatChannel: '', chatHandle: '', timezone: '',
    // Platform vetting
    platformStoreUrl: '', tradeAssurance: false, goldSupplier: false, yearsOnPlatform: 0,
    // Region
    region: '', countryCode: '', port: '',
    // Commercial
    currency: 'USD', paymentTerms: '', incoterms: '', minimumOrderValueCents: 0,
    // Lead times
    shippingLeadTimeDays: 0, defaultShippingMethod: '',
    // Sample
    sampleCostCents: 0, sampleLeadTimeDays: 0, sampleReceived: false,
    // Misc
    notes: ''
  });
  const [certs, setCerts] = useState<string[]>([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  function field<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm({ ...form, [k]: v });
  }
  function toggleCert(c: string) {
    setCerts(certs.includes(c) ? certs.filter(x => x !== c) : [...certs, c]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const { getFunctions, httpsCallable } = await import('firebase/functions');
      const { getApps, initializeApp } = await import('firebase/app');
      const app = getApps()[0] ?? initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      });
      // Drop empty optional strings/zeros so the callable's optional validation accepts them.
      const payload: Record<string, unknown> = { ...form, certifications: certs };
      for (const k of Object.keys(payload)) {
        const v = payload[k];
        if (v === '' || v === 0) delete payload[k];
      }
      // Required numeric back in
      payload.defaultLeadTimeDays = form.defaultLeadTimeDays;
      payload.name = form.name;
      payload.contactEmail = form.contactEmail;
      payload.platform = form.platform;

      await httpsCallable(getFunctions(app), 'createSupplier')(payload);
      setOk(true);
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  }

  if (ok) return <div><h1 className="text-2xl font-bold">Supplier created</h1><a className="text-brand underline" href="/admin/suppliers">Back to list</a></div>;

  const inp = 'w-full rounded border border-slate-300 px-3 py-2';
  const lbl = 'block text-sm font-medium';
  const section = 'rounded-lg border border-slate-200 bg-white p-4 space-y-3';

  return (
    <div>
      <h1 className="text-2xl font-bold">New supplier</h1>
      <p className="mt-1 text-sm text-slate-600">Capture everything Alibaba/AliExpress/CJ shows on the supplier profile. Admin-only.</p>

      <form onSubmit={submit} className="mt-6 max-w-3xl space-y-4">
        <div className={section}>
          <h2 className="font-semibold">Identity</h2>
          <input required placeholder="Display name *" value={form.name} onChange={e => field('name', e.target.value)} className={inp} />
          <input placeholder="Legal entity name (e.g. Shenzhen XYZ Co. Ltd)" value={form.legalEntityName} onChange={e => field('legalEntityName', e.target.value)} className={inp} />
          <input placeholder="Business license number" value={form.businessLicenseNumber} onChange={e => field('businessLicenseNumber', e.target.value)} className={inp} />
        </div>

        <div className={section}>
          <h2 className="font-semibold">Contact</h2>
          <input required type="email" placeholder="Contact email *" value={form.contactEmail} onChange={e => field('contactEmail', e.target.value)} className={inp} />
          <input placeholder="Contact name" value={form.contactName} onChange={e => field('contactName', e.target.value)} className={inp} />
          <input placeholder="Phone (E.164, e.g. +8613800138000)" value={form.phone} onChange={e => field('phone', e.target.value)} className={inp} />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.chatChannel} onChange={e => field('chatChannel', e.target.value)} className={inp}>
              {CHAT_CHANNELS.map(c => <option key={c} value={c}>{c || 'chat channel'}</option>)}
            </select>
            <input placeholder="Chat handle / ID" value={form.chatHandle} onChange={e => field('chatHandle', e.target.value)} className={inp} />
          </div>
          <input placeholder="Timezone (e.g. Asia/Shanghai)" value={form.timezone} onChange={e => field('timezone', e.target.value)} className={inp} />
        </div>

        <div className={section}>
          <h2 className="font-semibold">Platform & vetting</h2>
          <select value={form.platform} onChange={e => field('platform', e.target.value)} className={inp}>
            {PLATFORMS.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
          </select>
          <input placeholder="Platform store URL" value={form.platformStoreUrl} onChange={e => field('platformStoreUrl', e.target.value)} className={inp} />
          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.tradeAssurance} onChange={e => field('tradeAssurance', e.target.checked)} />
              Trade Assurance
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.goldSupplier} onChange={e => field('goldSupplier', e.target.checked)} />
              Gold Supplier
            </label>
            <label className="text-sm">
              Years on platform
              <input type="number" min={0} max={100} value={form.yearsOnPlatform} onChange={e => field('yearsOnPlatform', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
          </div>
        </div>

        <div className={section}>
          <h2 className="font-semibold">Region & logistics</h2>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Region" value={form.region} onChange={e => field('region', e.target.value)} className={inp} />
            <input placeholder="Country (ISO-2, e.g. CN)" value={form.countryCode} maxLength={2} onChange={e => field('countryCode', e.target.value.toUpperCase())} className={inp} />
            <input placeholder="Port (e.g. Shenzhen)" value={form.port} onChange={e => field('port', e.target.value)} className={inp} />
          </div>
        </div>

        <div className={section}>
          <h2 className="font-semibold">Commercial terms</h2>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Currency (ISO, e.g. USD)" value={form.currency} maxLength={3} onChange={e => field('currency', e.target.value.toUpperCase())} className={inp} />
            <select value={form.incoterms} onChange={e => field('incoterms', e.target.value)} className={inp}>
              {INCOTERMS.map(i => <option key={i} value={i}>{i || 'incoterms'}</option>)}
            </select>
            <label className="text-sm">
              MOV (cents)
              <input type="number" min={0} value={form.minimumOrderValueCents} onChange={e => field('minimumOrderValueCents', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
          </div>
          <input placeholder='Payment terms (e.g. "T/T 30/70", "Trade Assurance")' value={form.paymentTerms} onChange={e => field('paymentTerms', e.target.value)} className={inp} />
        </div>

        <div className={section}>
          <h2 className="font-semibold">Lead times</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className={lbl}>
              Production lead time (days) *
              <input required type="number" min={1} max={90} value={form.defaultLeadTimeDays} onChange={e => field('defaultLeadTimeDays', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
            <label className={lbl}>
              Shipping lead time (days)
              <input type="number" min={0} max={120} value={form.shippingLeadTimeDays} onChange={e => field('shippingLeadTimeDays', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
          </div>
          <input placeholder="Default shipping method (e.g. ePacket, DHL, Sea)" value={form.defaultShippingMethod} onChange={e => field('defaultShippingMethod', e.target.value)} className={inp} />
        </div>

        <div className={section}>
          <h2 className="font-semibold">Sample</h2>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              Sample cost (cents)
              <input type="number" min={0} value={form.sampleCostCents} onChange={e => field('sampleCostCents', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
            <label className="text-sm">
              Sample lead time (days)
              <input type="number" min={0} max={120} value={form.sampleLeadTimeDays} onChange={e => field('sampleLeadTimeDays', Number(e.target.value))} className={`mt-1 ${inp}`} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.sampleReceived} onChange={e => field('sampleReceived', e.target.checked)} />
            Sample already received & inspected
          </label>
        </div>

        <div className={section}>
          <h2 className="font-semibold">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {CERT_OPTIONS.map(c => (
              <label key={c} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${certs.includes(c) ? 'border-brand bg-teal-50' : 'border-slate-300'}`}>
                <input type="checkbox" className="hidden" checked={certs.includes(c)} onChange={() => toggleCert(c)} />
                {c}
              </label>
            ))}
          </div>
        </div>

        <textarea placeholder="Internal notes" value={form.notes} onChange={e => field('notes', e.target.value)} className={`h-24 ${inp}`} />

        <button disabled={busy} className="rounded bg-brand px-6 py-2 text-white disabled:opacity-50">
          {busy ? 'Saving…' : 'Create supplier'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  );
}
