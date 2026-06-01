# Allyoucanuse.com

Premium dropshipping ecommerce platform. See [prd.md](./prd.md) for the full product blueprint.

## Tech stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Firebase: Auth, Firestore, Storage, Cloud Functions, Cloud Scheduler, Hosting
- Stripe Checkout + webhooks for payments
- Resend (or similar) for transactional email
- OpenAI for the AI Operations Assistant (backend-only)

## Project layout
```
apps/web        Next.js storefront + admin
functions       Firebase Cloud Functions (TypeScript)
firestore.rules Security rules
storage.rules   Storage rules
firebase.json   Firebase configuration
prd.md          Product Requirements Document
```

## Local development
1. `cp .env.example .env.local` and fill in the values you have so far.
2. `npm install` (root) — installs workspaces.
3. `npm run dev` — starts the web app at http://localhost:3000.
4. (optional) `firebase emulators:start` to run the Firebase backend locally.

## Phase roadmap
See `prd.md` section 6 — V0 through V10. Each phase is built on its own git branch:

- `v0-setup` — project scaffolding (this branch)
- `v1-storefront` — customer storefront MVP
- `v2-firebase-backend` — Firestore schema + security rules + function skeletons
- `v3-admin-dashboard` — admin panel
- `v4-stripe-checkout` — payments
- `v5-customer-comms` — emails + support tickets
- `v6-ai-assistant` — AI Operations Assistant
- `v7-supplier-workflow` — supplier management + fulfillment
- `v8-analytics-automation` — pixels + scheduled jobs
- `v9-security-hardening` — strict rules, audit logs, RBAC, backups
- `v10-premium-scaling` — multi-niche, themes, loyalty, A/B testing

## Safety rules
- Never commit secrets. Use `.env.local` (gitignored).
- All payment + AI + supplier secrets live in Cloud Functions only.
- AI cannot issue refunds, cancel orders, or change prices without admin approval.
