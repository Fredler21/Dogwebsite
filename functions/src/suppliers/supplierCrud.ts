import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';

function requireAdmin(req: CallableRequest): void {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLATFORMS = ['cjdropshipping','aliexpress','private','other'] as const;

interface SupplierInput {
  name?: string; contactEmail?: string; contactName?: string;
  platform?: string; region?: string;
  defaultLeadTimeDays?: number; notes?: string; active?: boolean;
}

function validate(input: SupplierInput): void {
  if (!input.name || input.name.length < 2 || input.name.length > 120)
    throw new HttpsError('invalid-argument', 'name 2-120 chars required');
  if (!input.contactEmail || !EMAIL_RX.test(input.contactEmail))
    throw new HttpsError('invalid-argument', 'valid contactEmail required');
  if (!input.platform || !PLATFORMS.includes(input.platform as typeof PLATFORMS[number]))
    throw new HttpsError('invalid-argument', `platform must be one of ${PLATFORMS.join(',')}`);
  if (typeof input.defaultLeadTimeDays !== 'number' || input.defaultLeadTimeDays < 1 || input.defaultLeadTimeDays > 90)
    throw new HttpsError('invalid-argument', 'defaultLeadTimeDays must be 1-90');
}

export const createSupplier = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const input = (req.data ?? {}) as SupplierInput;
  validate(input);
  const now = Date.now();
  const ref = await db.collection('suppliers').add({
    name: input.name,
    contactEmail: input.contactEmail,
    contactName: input.contactName ?? null,
    platform: input.platform,
    region: input.region ?? 'unknown',
    defaultLeadTimeDays: input.defaultLeadTimeDays,
    notes: input.notes ?? null,
    active: input.active !== false,
    totalOrdersFulfilled: 0,
    createdAt: now, updatedAt: now
  });
  return { ok: true, id: ref.id };
});

export const updateSupplier = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { id, patch } = (req.data ?? {}) as { id?: string; patch?: Partial<SupplierInput> };
  if (!id || !patch) throw new HttpsError('invalid-argument', 'id + patch required');
  if (patch.contactEmail && !EMAIL_RX.test(patch.contactEmail))
    throw new HttpsError('invalid-argument', 'invalid contactEmail');
  if (patch.platform && !PLATFORMS.includes(patch.platform as typeof PLATFORMS[number]))
    throw new HttpsError('invalid-argument', 'invalid platform');
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
