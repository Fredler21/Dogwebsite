import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';
import { isEmail, isInRange, isNonEmptyString } from '../lib/validation';

// V2 stub: full Stripe integration lands in V4.
export const createCheckoutSession = onCall(async (req: CallableRequest) => {
  const { items, customerEmail } = (req.data ?? {}) as {
    items?: Array<{ productId: string; quantity: number }>;
    customerEmail?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpsError('invalid-argument', 'Cart is empty.');
  }
  if (!isEmail(customerEmail)) {
    throw new HttpsError('invalid-argument', 'Valid email required.');
  }
  for (const i of items) {
    if (!isNonEmptyString(i.productId) || !isInRange(i.quantity, 1, 100)) {
      throw new HttpsError('invalid-argument', 'Invalid cart item.');
    }
  }

  // Server-side price recompute (NEVER trust client prices).
  const products = await Promise.all(items.map(i => db.collection('products').doc(i.productId).get()));
  let subtotal = 0;
  for (let i = 0; i < products.length; i++) {
    const snap = products[i];
    if (!snap.exists) throw new HttpsError('not-found', `Product ${items[i].productId} not found`);
    const p = snap.data() as { price: number; status: string };
    if (p.status !== 'active') throw new HttpsError('failed-precondition', 'Product unavailable');
    subtotal += p.price * items[i].quantity;
  }

  // TODO V4: create Stripe Checkout Session, save draft order, return URL.
  return { ok: true, subtotal, todo: 'V4 wires Stripe' };
});
