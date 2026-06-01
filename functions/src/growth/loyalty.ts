import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { db } from '../lib/admin';

/**
 * Loyalty: 1 point per $1 spent (paid orders only). Redeemable as 100 pts = $1 off.
 * Stored on /users/{uid}.{loyaltyPoints, loyaltyTier}.
 */
export const awardLoyaltyOnPaid = onDocumentUpdated('orders/{id}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if (before.paymentStatus === 'paid' || after.paymentStatus !== 'paid') return;
  if (!after.userId) return;

  const dollars = Math.floor((after.grandTotal ?? 0) / 100);
  if (dollars <= 0) return;
  const userRef = db.collection('users').doc(after.userId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const cur = (snap.data()?.loyaltyPoints as number | undefined) ?? 0;
    const next = cur + dollars;
    const tier = next >= 1000 ? 'gold' : next >= 250 ? 'silver' : 'bronze';
    tx.set(userRef, { loyaltyPoints: next, loyaltyTier: tier, updatedAt: Date.now() }, { merge: true });
  });
});

/**
 * Referral: customer A shares a code; new customer B uses it at checkout.
 * On B's first paid order: B gets $5 off (handled in discounts), A gets 50 loyalty pts.
 */
export const recordReferral = onCall(async (req: CallableRequest) => {
  const { referrerCode, refereeUid } = (req.data ?? {}) as { referrerCode?: string; refereeUid?: string };
  if (!referrerCode || !refereeUid) throw new HttpsError('invalid-argument', 'referrerCode + refereeUid required');
  const codeSnap = await db.collection('referralCodes').doc(referrerCode).get();
  if (!codeSnap.exists) throw new HttpsError('not-found', 'Invalid referral code');
  const referrerUid = codeSnap.data()?.uid as string;
  if (referrerUid === refereeUid) throw new HttpsError('failed-precondition', 'Cannot refer yourself');

  await db.collection('referrals').add({
    referrerUid, refereeUid, status: 'pending', createdAt: Date.now()
  });
  return { ok: true };
});
