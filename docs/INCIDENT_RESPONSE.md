# Incident Response

## Severity levels

| Sev | Definition | Response |
|---|---|---|
| **SEV1** | Customer data exposed, payments broken, site down | Page super admin immediately. Public status update < 1h. |
| **SEV2** | Partial outage, AI agent misbehaving, scheduled jobs failing | Acknowledge in #ops within 1h. Fix < 24h. |
| **SEV3** | Minor bug, edge case, cosmetic | Ticket. Fix in next release. |

## SEV1 playbook

1. **Contain.** Disable the misbehaving function: `firebase functions:delete <name>` or set the automation level to `manual` from `/admin/ai/automation`.
2. **Revoke.** If credential leak: `setAdminClaim` revoke, rotate Stripe keys, rotate OpenAI key, rotate Resend key.
3. **Communicate.** Email affected customers within 72h if PII involved (GDPR / CAN-SPAM). Use the `incident_notification` template (TODO).
4. **Forensics.** Pull `/auditLogs`, `/aiLogs`, Stripe events, Firebase Auth logs.
5. **Post-mortem.** Within 5 business days, write a doc in `docs/incidents/YYYY-MM-DD-summary.md`.

## Common scenarios

- **Stripe webhook reprocessing duplicates** → Check idempotency key in `/orders.processedEvents`. Replay event from Stripe dashboard.
- **AI made a bad call** → Read `/aiLogs` filtered by `flagged:true`. Tighten prompt in `aiPrompts.ts`. Add the example to a regression test.
- **Customer reports refund not received** → Check Stripe dashboard first, then `/auditLogs` for `order.refund` entry, then bank dispute timeline (5-10 business days).
