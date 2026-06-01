# V10 — Premium Scaling — Definition of Done

- [x] Theme system with 3 presets (car, pet, home) via CSS variables
- [x] Multi-store data model + admin /stores page + docs
- [x] Landing-page route `/landing/[slug]` (stub backed by /landingPages collection)
- [x] A/B testing helper (`lib/experiments.ts`) with stable bucketing
- [x] Supplier scorecards: nightly `computeSupplierScorecards`
- [x] Loyalty: 1pt/$1, tier auto-set, awarded on `paymentStatus -> paid`
- [x] Referral: `recordReferral` callable + /referrals collection
- [x] Docs: MULTI_SITE_SETUP, THEME_AUTHORING, SCALING_NOTES, LAUNCH_CHECKLIST_V10
- [ ] Middleware host-based store routing (depends on merged firebase.json + hosting targets)
- [ ] Landing-page CMS UI (admin) — schema is set; UI iteration after launch
- [ ] Advanced AI rules engine — design in PRD §21.10; deferred to post-launch
