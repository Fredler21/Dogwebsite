import * as admin from 'firebase-admin';
import { HttpsError, type CallableRequest } from 'firebase-functions/v2/https';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export { admin };

/** Throws unauthenticated/permission-denied if caller is not an admin. */
export function assertAdmin(req: CallableRequest<unknown>): void {
  if (!req.auth) {
    throw new HttpsError('unauthenticated', 'Sign-in required.');
  }
  const claims = (req.auth.token ?? {}) as Record<string, unknown>;
  if (claims.admin !== true && claims.role !== 'admin' && claims.role !== 'superadmin') {
    throw new HttpsError('permission-denied', 'Admin role required.');
  }
}
