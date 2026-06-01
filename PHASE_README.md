# V4 — Stripe Checkout + Webhook

Adds Stripe payments to the order lifecycle. Customer hits `/checkout`, server creates a Stripe Checkout Session with server-recomputed prices, customer pays on Stripe-hosted page, webhook flips the order to `paid`.

See `docs/STRIPE_SETUP.md` and `docs/STRIPE_TESTING.md`.
