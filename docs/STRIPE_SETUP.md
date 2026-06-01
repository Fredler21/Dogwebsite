# Stripe Setup — Test Mode

1. Create a Stripe account at https://dashboard.stripe.com.
2. Copy your **test mode** keys (toggle "Test mode" in the dashboard):
   - `STRIPE_SECRET_KEY` (server only — store as Firebase Functions secret)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend safe)
3. Configure success/cancel URLs:
   - `CHECKOUT_SUCCESS_URL=http://localhost:3000/order-success?session_id={CHECKOUT_SESSION_ID}`
   - `CHECKOUT_CANCEL_URL=http://localhost:3000/checkout/cancel`

## Local webhook testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# Forward webhooks to the local Functions emulator
stripe listen --forward-to localhost:5001/<project-id>/us-central1/stripeWebhook

# Copy the printed signing secret to STRIPE_WEBHOOK_SECRET in .env.local
```

## Setting Firebase secrets in production

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase deploy --only functions
```

## Production webhook

In Stripe Dashboard → Developers → Webhooks → Add endpoint:
`https://<region>-<project-id>.cloudfunctions.net/stripeWebhook`

Subscribe to: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`.
