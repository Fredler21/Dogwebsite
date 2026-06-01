# Security Review (V9)

## Scope

Rules, authn/authz, secrets, PII, input validation, rate limiting, audit logging, backups.

## Firestore rules

- Default deny on all paths.
- Public read limited to `active == true` rows on `/products`, `/categories`, `/landingPages`.
- Customers may only read their own `/orders` and `/carts`. Order writes server-side only (Stripe webhook).
- `/users` writes by owner explicitly strip `admin` and `roles` keys (privilege escalation guard).
- `/supportTickets` create rule enforces shape + enum + length + initial status `open`.
- Admin-only collections: suppliers, supplierOrders, discounts, aiLogs, aiAlerts, aiReports, auditLogs, emailLogs, emailQueue, experiments, config.
- Server-only: rateLimits, aiLogs (writes), aiReports (writes), auditLogs (writes), emailLogs (writes), aiAlerts (create/delete).

## Authn / authz

- Admin = Firebase Auth custom claim `admin === true`. Set only via `setAdminClaim` callable, callable only by `SUPER_ADMIN_EMAIL`.
- Super admin email pinned via `firebase functions:params:set SUPER_ADMIN_EMAIL`.
- 2FA required on all admin Firebase Auth accounts (see ADMIN_2FA.md).

## Secrets

- All secrets via Firebase Secret Manager (`defineSecret`) — never `.env` checked in.
- Gitleaks workflow scans PRs and main.
- See SECRETS_SCANNING.md for the full list.

## PII

- We collect: email, name, shipping address, phone. Stored in `/orders` and `/users`.
- We never store: full card numbers (Stripe Checkout handles), CVV, full DOB, government IDs.
- Customer-facing pages never display: `supplierId`, `supplierCost`, internal SKUs.

## Rate limiting

- `rateLimit({key, limit, windowSec})` helper applied to: support ticket create (5 / 10min / IP), refund request (3 / day / customer), login attempts (Firebase Auth built-in).

## Audit logging

- `audit()` writes to `/auditLogs` on: admin grant/revoke, refund issued, order status manual change, discount created, supplier created/edited, AI action approved.
- Auditlogs are admin-readable, server-only writable.

## OWASP

See OWASP_CHECKLIST.md for the Top 10 walkthrough.
