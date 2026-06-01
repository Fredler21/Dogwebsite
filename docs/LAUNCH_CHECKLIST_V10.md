# Launch Checklist V10

## Code
- [ ] All previous branches (V0-V9) merged to main, tests green.
- [ ] `firebase deploy` runs cleanly from a fresh clone.
- [ ] `npm run build` in `apps/web` produces a < 5MB JS budget.

## Firebase / GCP
- [ ] Production project (`allyoucanuse-prod`) created and billed.
- [ ] Firestore rules deployed and tested in emulator.
- [ ] Cloud Functions deployed, all secrets set (Stripe, OpenAI, Resend).
- [ ] Scheduled jobs visible in Cloud Scheduler.
- [ ] Backup bucket exists; backup-verify Action passed once.

## Stripe
- [ ] Live mode keys swapped in.
- [ ] Webhook endpoint registered against the live keys.
- [ ] Tax + shipping zones configured.
- [ ] Test a $1 real order end-to-end.

## Analytics
- [ ] GA4 stream live.
- [ ] Meta pixel firing PageView + Purchase.
- [ ] TikTok pixel firing.
- [ ] Pinterest tag firing.
- [ ] Sitemap submitted to Search Console.

## Security
- [ ] Super admin email pinned via params.
- [ ] Admin 2FA enforced on all admin users.
- [ ] Gitleaks workflow green on main.
- [ ] Backup verifier workflow green.

## Operations
- [ ] Incident playbook reviewed by the team.
- [ ] On-call rotation set (week 1 = founder).
- [ ] Support inbox routed to a real human.
- [ ] AI automation level set to `suggest` (default).

## Day-1 commerce
- [ ] At least 20 active products with images, prices, descriptions.
- [ ] At least 1 supplier per product.
- [ ] Shipping policy, refund policy, terms, privacy live.
- [ ] Contact + support pages live.
- [ ] Landing page for opening promo published.
