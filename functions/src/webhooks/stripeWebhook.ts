import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import type { Request, Response } from 'express';
import { db } from '../lib/admin';
import { stripe } from '../lib/stripe';

const WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

export const stripeWebhook = onRequest(
  { secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    if (typeof sig !== 'string') { res.status(400).send('Missing signature'); return; }

    let event;
    try {
      // req.rawBody is provided by Firebase Functions for webhook handlers.
      event = stripe().webhooks.constructEvent(
        (req as Request & { rawBody: Buffer }).rawBody,
        sig,
        WEBHOOK_SECRET.value()
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'invalid signature';
      res.status(400).send(`Webhook Error: ${msg}`); return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const s = event.data.object as { id: string; metadata?: { orderId?: string; discountCode?: string }; payment_intent?: string };
        const orderId = s.metadata?.orderId;
        if (orderId) {
          const ref = db.collection('orders').doc(orderId);
          const snap = await ref.get();
          // Idempotent: only mark paid if currently pending.
          if (snap.exists && snap.data()?.paymentStatus === 'pending') {
            await ref.update({
              paymentStatus: 'paid',
              stripePaymentIntentId: typeof s.payment_intent === 'string' ? s.payment_intent : null,
              updatedAt: Date.now()
            });
            // Increment discount usedCount if any.
            const code = s.metadata?.discountCode;
            if (code) {
              await db.collection('discounts').doc(code.toUpperCase())
                .update({ usedCount: (snap.data()?.usedCount ?? 0) + 1 })
                .catch(() => { /* ignore */ });
            }
          }
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        const pi = event.data.object as { id: string; metadata?: { orderId?: string } };
        const orderId = pi.metadata?.orderId;
        if (orderId) {
          await db.collection('orders').doc(orderId).update({
            paymentStatus: 'failed', updatedAt: Date.now()
          });
        }
      } else if (event.type === 'charge.refunded') {
        const ch = event.data.object as { metadata?: { orderId?: string }; amount_refunded: number; amount: number };
        const orderId = ch.metadata?.orderId;
        if (orderId) {
          const status = ch.amount_refunded >= ch.amount ? 'refunded' : 'partially_refunded';
          await db.collection('orders').doc(orderId).update({
            paymentStatus: status, updatedAt: Date.now()
          });
        }
      }

      await db.collection('auditLogs').add({
        actor: 'stripe-webhook',
        action: event.type,
        eventId: event.id,
        createdAt: Date.now()
      });

      res.json({ received: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'handler error';
      res.status(500).send(msg);
    }
  }
);
