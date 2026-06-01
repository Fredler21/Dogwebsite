import Stripe from 'stripe';
import { defineSecret } from 'firebase-functions/params';

const STRIPE_SECRET = defineSecret('STRIPE_SECRET_KEY');

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY ?? STRIPE_SECRET.value();
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  _stripe = new Stripe(key, { apiVersion: '2024-06-20' as Stripe.LatestApiVersion });
  return _stripe;
}

export const SUCCESS_URL = process.env.CHECKOUT_SUCCESS_URL ?? 'https://dogvanta.com/order-success?session_id={CHECKOUT_SESSION_ID}';
export const CANCEL_URL = process.env.CHECKOUT_CANCEL_URL ?? 'https://dogvanta.com/cart';
