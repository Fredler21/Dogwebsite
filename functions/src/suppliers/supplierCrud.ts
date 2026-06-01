import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';

function requireAdmin(req: CallableRequest): void {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RX = /^https?:\/\/[^\s]+$/i;
const PLATFORMS = ['alibaba','cjdropshipping','aliexpress','private','other'] as const;
const INCOTERMS = ['EXW','FOB','CIF','DDP','DAP'] as const;
const CHAT_CHANNELS = ['wechat','whatsapp','alibaba','skype','email'] as const;
const CURRENCY_RX = /^[A-Z]{3}$/;
const COUNTRY_RX = /^[A-Z]{2}$/;
const ALLOWED_CERTS = new Set([
  'CE','FDA','FCC','ISO9001','ISO14001','REACH','CPSIA','RoHS','UL','BSCI','SEDEX'
]);

interface SupplierInput {
  name?: string;
  legalEntityName?: string;
  businessLicenseNumber?: string;

  contactEmail?: string;
  contactName?: string;
  phone?: string;
  chatChannel?: string;
  chatHandle?: string;
  timezone?: string;

  platform?: string;
  platformStoreUrl?: string;
  tradeAssurance?: boolean;
  goldSupplier?: boolean;
  yearsOnPlatform?: number;

  region?: string;
  countryCode?: string;
  port?: string;

  currency?: string;
  paymentTerms?: string;
  incoterms?: string;
  minimumOrderValueCents?: number;

  defaultLeadTimeDays?: number;
  shippingLeadTimeDays?: number;
  defaultShippingMethod?: string;

  sampleCostCents?: number;
  sampleLeadTimeDays?: number;
  sampleReceived?: boolean;

  certifications?: string[];

  notes?: string;
  active?: boolean;
}

function bad(msg: string): never { throw new HttpsError('invalid-argument', msg); }

function validateOptionalFields(input: SupplierInput): void {
  if (input.platformStoreUrl && !URL_RX.test(input.platformStoreUrl))
    bad('platformStoreUrl must be http(s) URL');
  if (input.currency && !CURRENCY_RX.test(input.currency))
    bad('currency must be ISO 4217 (e.g. USD, CNY)');
  if (input.countryCode && !COUNTRY_RX.test(input.countryCode))
    bad('countryCode must be ISO alpha-2 (e.g. CN)');
  if (input.incoterms && !INCOTERMS.includes(input.incoterms as typeof INCOTERMS[number]))
    bad(`incoterms must be one of ${INCOTERMS.join(',')}`);
  if (input.chatChannel && !CHAT_CHANNELS.includes(input.chatChannel as typeof CHAT_CHANNELS[number]))
    bad(`chatChannel must be one of ${CHAT_CHANNELS.join(',')}`);
  if (input.shippingLeadTimeDays != null &&
      (typeof input.shippingLeadTimeDays !== 'number' || input.shippingLeadTimeDays < 0 || input.shippingLeadTimeDays > 120))
    bad('shippingLeadTimeDays must be 0-120');
  if (input.yearsOnPlatform != null &&
      (typeof input.yearsOnPlatform !== 'number' || input.yearsOnPlatform < 0 || input.yearsOnPlatform > 100))
    bad('yearsOnPlatform must be 0-100');
  if (input.minimumOrderValueCents != null &&
      (typeof input.minimumOrderValueCents !== 'number' || input.minimumOrderValueCents < 0))
    bad('minimumOrderValueCents must be >= 0');
  if (input.sampleCostCents != null &&
      (typeof input.sampleCostCents !== 'number' || input.sampleCostCents < 0))
    bad('sampleCostCents must be >= 0');
  if (input.sampleLeadTimeDays != null &&
      (typeof input.sampleLeadTimeDays !== 'number' || input.sampleLeadTimeDays < 0 || input.sampleLeadTimeDays > 120))
    bad('sampleLeadTimeDays must be 0-120');
  if (input.certifications) {
    if (!Array.isArray(input.certifications)) bad('certifications must be string[]');
    for (const c of input.certifications) {
      if (typeof c !== 'string' || !ALLOWED_CERTS.has(c)) bad(`unknown certification: ${c}`);
    }
  }
  if (input.businessLicenseNumber &&
      (typeof input.businessLicenseNumber !== 'string' || input.businessLicenseNumber.length > 64))
    bad('businessLicenseNumber too long');
}

function validate(input: SupplierInput): void {
  if (!input.name || input.name.length < 2 || input.name.length > 120)
    bad('name 2-120 chars required');
  if (!input.contactEmail || !EMAIL_RX.test(input.contactEmail))
    bad('valid contactEmail required');
  if (!input.platform || !PLATFORMS.includes(input.platform as typeof PLATFORMS[number]))
    bad(`platform must be one of ${PLATFORMS.join(',')}`);
  if (typeof input.defaultLeadTimeDays !== 'number' || input.defaultLeadTimeDays < 1 || input.defaultLeadTimeDays > 90)
    bad('defaultLeadTimeDays must be 1-90');
  validateOptionalFields(input);
}

function buildDoc(input: SupplierInput, now: number) {
  return {
    name: input.name,
    legalEntityName: input.legalEntityName ?? null,
    businessLicenseNumber: input.businessLicenseNumber ?? null,

    contactEmail: input.contactEmail,
    contactName: input.contactName ?? null,
    phone: input.phone ?? null,
    chatChannel: input.chatChannel ?? null,
    chatHandle: input.chatHandle ?? null,
    timezone: input.timezone ?? null,

    platform: input.platform,
    platformStoreUrl: input.platformStoreUrl ?? null,
    tradeAssurance: input.tradeAssurance === true,
    goldSupplier: input.goldSupplier === true,
    yearsOnPlatform: input.yearsOnPlatform ?? null,

    region: input.region ?? 'unknown',
    countryCode: input.countryCode ?? null,
    port: input.port ?? null,

    currency: input.currency ?? 'USD',
    paymentTerms: input.paymentTerms ?? null,
    incoterms: input.incoterms ?? null,
    minimumOrderValueCents: input.minimumOrderValueCents ?? null,

    defaultLeadTimeDays: input.defaultLeadTimeDays,
    shippingLeadTimeDays: input.shippingLeadTimeDays ?? null,
    defaultShippingMethod: input.defaultShippingMethod ?? null,

    sampleCostCents: input.sampleCostCents ?? null,
    sampleLeadTimeDays: input.sampleLeadTimeDays ?? null,
    sampleReceived: input.sampleReceived === true,

    certifications: input.certifications ?? [],

    notes: input.notes ?? null,
    active: input.active !== false,
    totalOrdersFulfilled: 0,
    createdAt: now, updatedAt: now
  };
}

export const createSupplier = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const input = (req.data ?? {}) as SupplierInput;
  validate(input);
  const ref = await db.collection('suppliers').add(buildDoc(input, Date.now()));
  return { ok: true, id: ref.id };
});

export const updateSupplier = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { id, patch } = (req.data ?? {}) as { id?: string; patch?: SupplierInput };
  if (!id || !patch) throw new HttpsError('invalid-argument', 'id + patch required');
  if (patch.contactEmail && !EMAIL_RX.test(patch.contactEmail))
    bad('invalid contactEmail');
  if (patch.platform && !PLATFORMS.includes(patch.platform as typeof PLATFORMS[number]))
    bad('invalid platform');
  validateOptionalFields(patch);
  await db.collection('suppliers').doc(id).update({ ...patch, updatedAt: Date.now() });
  return { ok: true };
});

export const setSupplierActive = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { id, active } = (req.data ?? {}) as { id?: string; active?: boolean };
  if (!id || typeof active !== 'boolean') throw new HttpsError('invalid-argument', 'id + active required');
  await db.collection('suppliers').doc(id).update({ active, updatedAt: Date.now() });
  return { ok: true };
});

/**
 * Record a vetting event (sample received, business license uploaded,
 * reference contact added, factory video call done, etc.) under
 * /suppliers/{id}/vetting/{eventId}. Admin-only.
 */
interface VettingInput {
  supplierId?: string;
  type?: 'business_license' | 'sample_ordered' | 'sample_received' | 'qc_notes' | 'reference_contact' | 'factory_video' | 'onsite_check';
  url?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
}

const VETTING_TYPES = ['business_license','sample_ordered','sample_received','qc_notes','reference_contact','factory_video','onsite_check'] as const;

export const recordSupplierVetting = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const input = (req.data ?? {}) as VettingInput;
  if (!input.supplierId) bad('supplierId required');
  if (!input.type || !VETTING_TYPES.includes(input.type)) bad('invalid vetting type');
  if (input.url && !URL_RX.test(input.url)) bad('url must be http(s)');
  if (input.contactEmail && !EMAIL_RX.test(input.contactEmail)) bad('invalid contactEmail');

  const supplierRef = db.collection('suppliers').doc(input.supplierId);
  const snap = await supplierRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'supplier not found');

  const now = Date.now();
  const ref = await supplierRef.collection('vetting').add({
    type: input.type,
    url: input.url ?? null,
    notes: input.notes ?? null,
    contactName: input.contactName ?? null,
    contactEmail: input.contactEmail ?? null,
    recordedBy: req.auth?.uid ?? null,
    createdAt: now
  });

  // Mirror sampleReceived flag onto the supplier doc for fast filtering.
  if (input.type === 'sample_received') {
    await supplierRef.update({ sampleReceived: true, updatedAt: now });
  }
  return { ok: true, id: ref.id };
});
