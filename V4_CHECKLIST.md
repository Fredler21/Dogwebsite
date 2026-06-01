# V4 — Stripe Checkout & Webhook — Definition of Done

- [x] `createCheckoutSession` callable: server-side price recompute, discount validation, draft order creation
- [x] `stripeWebhook` HTTPS function: signature verification, idempotent paid/failed/refunded handling
- [x] Frontend `startCheckout` helper that redirects to Stripe-hosted page
- [x] `/checkout`, `/order-success`, `/checkout/cancel` pages
- [x] Stripe + webhook secrets defined via Firebase Functions secrets
- [x] All events logged to `/auditLogs`
- [x] Setup + testing docs

Security invariants:
- Frontend never sees `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET`.
- Order `paymentStatus` only mutated by the webhook handler, not by the client.
- Cart prices recomputed server-side from `/products`.
