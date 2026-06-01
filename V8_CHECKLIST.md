# V8 — Analytics + Automation — Definition of Done

- [x] GA4 component (`anonymize_ip`, DNT respected)
- [x] Meta / TikTok / Pinterest pixel components
- [x] Cross-pixel `trackEvent` helper (`lib/track.ts`)
- [x] Scheduled: checkAbandonedCarts (every 6h)
- [x] Scheduled: checkDelayedOrders (every 12h, AI alerts)
- [x] Scheduled: sendReviewRequests (daily 10:00 ET)
- [x] Scheduled: lowStockAlerts (every 6h)
- [x] Scheduled: nudgeStuckSupplierOrders (daily 11:00 ET)
- [x] robots.ts
- [x] Product JSON-LD helper
- [x] Admin analytics dashboard (mock charts, ready to wire)
- [x] Docs: ANALYTICS_SETUP, SCHEDULED_JOBS, SEO_GUIDE
- [ ] Consent banner — V9 (security hardening branch handles cookies + PII)
- [ ] Real charts wired to Firestore aggregates
