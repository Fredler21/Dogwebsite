import { onRequest } from 'firebase-functions/v2/https';

// V2 stub. V4 verifies Stripe signature and updates order paymentStatus idempotently.
export const stripeWebhook = onRequest({ cors: false }, async (_req, res) => {
  res.status(501).json({ todo: 'V4 implements signature verification + event handling' });
});
