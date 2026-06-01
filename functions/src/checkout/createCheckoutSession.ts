import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';
import { stripe, SUCCESS_URL, CANCEL_URL } from '../lib/stripe';

type Input = {
  items: { productId: string; variantId?: string; quantity: number }[];
  customerEmail: string;
  discountCode?: string;
};

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export const createCheckoutSession = onCall<Input>({ secrets: ['STRIPE_SECRET_KEY'] }, async (req: CallableRequest<Input>) => {
  const { items, customerEmail, discountCode } = req.data ?? ({} as Input);
  if (!Array.isArray(items) || items.length === 0) throw new HttpsError('invalid-argument', 'Cart is empty');
  if (!isEmail(customerEmail)) throw new HttpsError('invalid-argument', 'Valid email required');
  if (items.length > 50) throw new HttpsError('invalid-argument', 'Too many line items');

  // Recompute prices server-side from Firestore — NEVER trust the client.
  const productSnaps = await Promise.all(
    items.map(i => db.collection('products').doc(i.productId).get())
  );

  const lineItems: { price_data: { currency: string; product_data: { name: string; images?: string[] }; unit_amount: number }; quantity: number }[] = [];
  let subtotal = 0;

  for (let i = 0; i < productSnaps.length; i++) {
    const snap = productSnaps[i];
    if (!snap.exists) throw new HttpsError('not-found', `Product ${items[i].productId} missing`);
    const p = snap.data() as { title: string; price: number; status: string; images?: string[] };
    if (p.status !== 'active') throw new HttpsError('failed-precondition', `${p.title} unavailable`);
    const qty = Math.max(1, Math.min(100, Math.floor(items[i].quantity)));
    subtotal += p.price * qty;
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: p.title, images: p.images?.slice(0, 1) },
        unit_amount: p.price
      },
      quantity: qty
    });
  }

  // Apply discount (validated server-side).
  let discountTotal = 0;
  if (discountCode) {
    const d = await db.collection('discounts').doc(discountCode.toUpperCase()).get();
    if (d.exists) {
      const data = d.data() as { active: boolean; type: string; value: number; endsAt?: number; usedCount: number; maxUses?: number };
      const valid = data.active
        && (!data.endsAt || data.endsAt > Date.now())
        && (!data.maxUses || data.usedCount < data.maxUses);
      if (valid && data.type === 'percent') discountTotal = Math.floor(subtotal * (data.value / 100));
      else if (valid && data.type === 'fixed') discountTotal = Math.min(subtotal, data.value);
    }
  }

  const grandTotal = subtotal - discountTotal;
  const now = Date.now();

  // Create draft order BEFORE Stripe so we have an ID to attach as metadata.
  const orderRef = await db.collection('orders').add({
    orderNumber: `#${now}`,
    customerEmail,
    items: items.map((it, idx) => ({
      productId: it.productId,
      variantId: it.variantId ?? null,
      quantity: it.quantity,
      unitPrice: lineItems[idx].price_data.unit_amount
    })),
    subtotal,
    shippingTotal: 0,
    taxTotal: 0,
    discountTotal,
    grandTotal,
    paymentStatus: 'pending',
    fulfillmentStatus: 'unfulfilled',
    riskStatus: 'low',
    createdAt: now,
    updatedAt: now
  });

  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: customerEmail,
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
    metadata: { orderId: orderRef.id, discountCode: discountCode ?? '' }
  });

  await orderRef.update({ stripeCheckoutSessionId: session.id });

  return { url: session.url, sessionId: session.id, orderId: orderRef.id };
});
