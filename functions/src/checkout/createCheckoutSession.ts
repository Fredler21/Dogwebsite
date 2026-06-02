import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { admin, db } from '../lib/admin';
import { stripe, SUCCESS_URL, CANCEL_URL } from '../lib/stripe';

type Input = {
  items: { productId: string; variantId?: string; quantity: number }[];
  customerEmail: string;
  discountCode?: string;
};

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 checkout attempts per minute per identity

/**
 * Best-effort rate limiter using Firestore. Identity is the auth uid if signed
 * in, otherwise a hash of (email + ip). Throws HttpsError on overflow.
 */
async function rateLimit(identity: string): Promise<void> {
  const ref = db.collection('rateLimits').doc(`checkout_${identity}`);
  const now = Date.now();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() as { windowStart?: number; count?: number } | undefined;
    if (!data || !data.windowStart || now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      tx.set(ref, { windowStart: now, count: 1, updatedAt: now });
      return;
    }
    if ((data.count ?? 0) >= RATE_LIMIT_MAX) {
      throw new HttpsError('resource-exhausted', 'Too many checkout attempts. Please wait a minute and try again.');
    }
    tx.update(ref, { count: (data.count ?? 0) + 1, updatedAt: now });
  });
}

export const createCheckoutSession = onCall<Input>(
  {
    secrets: ['STRIPE_SECRET_KEY'],
    // App Check enforcement: drops calls that aren't from our official site.
    // Currently disabled until reCAPTCHA Enterprise site key is wired on the web.
    // To enable: set ENFORCE_APP_CHECK=true in functions env after configuring the client.
    enforceAppCheck: process.env.ENFORCE_APP_CHECK === 'true',
  },
  async (req: CallableRequest<Input>) => {
    const { items, customerEmail, discountCode } = req.data ?? ({} as Input);
    if (!Array.isArray(items) || items.length === 0) throw new HttpsError('invalid-argument', 'Cart is empty');
    if (!isEmail(customerEmail)) throw new HttpsError('invalid-argument', 'Valid email required');
    if (items.length > 50) throw new HttpsError('invalid-argument', 'Too many line items');

    // Rate-limit by uid (preferred) or email+ip fallback.
    const identity = req.auth?.uid ?? `${customerEmail}_${req.rawRequest.ip ?? 'unknown'}`;
    await rateLimit(identity);

    // Recompute prices server-side from Firestore — NEVER trust the client.
    const productSnaps = await Promise.all(
      items.map((i) => db.collection('products').doc(i.productId).get())
    );

    const lineItems: {
      price_data: { currency: string; product_data: { name: string; images?: string[] }; unit_amount: number };
      quantity: number;
    }[] = [];
    let subtotal = 0;

    for (let i = 0; i < productSnaps.length; i++) {
      const snap = productSnaps[i];
      if (!snap.exists) throw new HttpsError('not-found', `Product ${items[i].productId} missing`);
      const p = snap.data() as {
        title: string;
        price: number;
        status: string;
        images?: string[];
        trackInventory?: boolean;
        inventoryCount?: number;
      };
      if (p.status !== 'active') throw new HttpsError('failed-precondition', `${p.title} unavailable`);
      const qty = Math.max(1, Math.min(100, Math.floor(items[i].quantity)));

      // Soft stock check at checkout-create time (hard check happens in webhook txn).
      if (p.trackInventory && typeof p.inventoryCount === 'number' && p.inventoryCount < qty) {
        throw new HttpsError('failed-precondition', `${p.title} is out of stock`);
      }

      subtotal += p.price * qty;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: p.title, images: p.images?.slice(0, 1) },
          unit_amount: p.price,
        },
        quantity: qty,
      });
    }

    // Apply discount (validated server-side).
    let discountTotal = 0;
    if (discountCode) {
      const d = await db.collection('discounts').doc(discountCode.toUpperCase()).get();
      if (d.exists) {
        const data = d.data() as {
          active: boolean;
          type: string;
          value: number;
          endsAt?: number;
          usedCount: number;
          maxUses?: number;
        };
        const valid =
          data.active &&
          (!data.endsAt || data.endsAt > Date.now()) &&
          (!data.maxUses || data.usedCount < data.maxUses);
        if (valid && data.type === 'percent') discountTotal = Math.floor(subtotal * (data.value / 100));
        else if (valid && data.type === 'fixed') discountTotal = Math.min(subtotal, data.value);
      }
    }

    const grandTotal = subtotal - discountTotal;
    const now = Date.now();

    // Create draft order BEFORE Stripe so we have an ID to attach as metadata.
    const orderRef = await db.collection('orders').add({
      orderNumber: `#${now}`,
      userId: req.auth?.uid ?? null,
      customerEmail,
      items: items.map((it, idx) => ({
        productId: it.productId,
        variantId: it.variantId ?? null,
        quantity: lineItems[idx].quantity,
        unitPrice: lineItems[idx].price_data.unit_amount,
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
      updatedAt: now,
    });

    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      // Collect shipping + phone — required for physical fulfillment.
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      phone_number_collection: { enabled: true },
      // Stripe-managed automatic tax (requires Stripe Tax to be enabled in dashboard).
      automatic_tax: { enabled: false },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      metadata: { orderId: orderRef.id, discountCode: discountCode ?? '' },
      payment_intent_data: {
        metadata: { orderId: orderRef.id },
      },
    });

    await orderRef.update({ stripeCheckoutSessionId: session.id });

    return { url: session.url, sessionId: session.id, orderId: orderRef.id };
  }
);

// Re-export for type inference helpers.
export type { Input as CreateCheckoutSessionInput };
// Keep firestore admin SDK reference alive for tree-shake safety.
void admin;
