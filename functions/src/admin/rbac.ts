import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
import { auth, db } from '../lib/admin';
import { audit } from '../lib/audit';

const SUPER_ADMIN_EMAIL = defineString('SUPER_ADMIN_EMAIL');

function requireSuperAdmin(req: CallableRequest): void {
  const email = req.auth?.token?.email;
  if (!email || email !== SUPER_ADMIN_EMAIL.value())
    throw new HttpsError('permission-denied', 'Super admin only');
}

export const setAdminClaim = onCall(async (req: CallableRequest) => {
  requireSuperAdmin(req);
  const { uid, admin } = (req.data ?? {}) as { uid?: string; admin?: boolean };
  if (!uid || typeof admin !== 'boolean') throw new HttpsError('invalid-argument', 'uid + admin required');

  const before = (await auth.getUser(uid)).customClaims ?? {};
  await auth.setCustomUserClaims(uid, { ...before, admin });
  await db.collection('users').doc(uid).set({ admin, updatedAt: Date.now() }, { merge: true });
  await audit({
    actor: req.auth?.uid ?? 'unknown',
    action: admin ? 'admin.grant' : 'admin.revoke',
    target: { collection: 'users', id: uid },
    before, after: { ...before, admin }
  });
  return { ok: true };
});

export const listAdmins = onCall(async (req: CallableRequest) => {
  requireSuperAdmin(req);
  const out: Array<{ uid: string; email: string | undefined }> = [];
  let token: string | undefined;
  do {
    const page = await auth.listUsers(1000, token);
    for (const u of page.users) {
      if (u.customClaims?.admin === true) out.push({ uid: u.uid, email: u.email });
    }
    token = page.pageToken;
  } while (token);
  return { admins: out };
});
