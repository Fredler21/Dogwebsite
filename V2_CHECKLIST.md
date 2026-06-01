# V2 — Firebase Backend MVP — Definition of Done

- [x] Firestore security rules baseline (`firestore.rules`)
- [x] Firestore composite indexes
- [x] Storage rules with size limit for support attachments
- [x] `functions/` workspace with TypeScript build
- [x] Admin SDK init + `assertAuth` / `assertAdmin` helpers
- [x] Backend TS types mirroring PRD section 10
- [x] Input validation helpers (email, length, enum, range, sanitize)
- [x] Cloud Function skeletons: createCheckoutSession, stripeWebhook, onOrderCreated, createSupportTicket, adminUpdateOrderStatus, processRefundRequest
- [x] Seed script for categories, products, supplier, settings
- [x] Docs: security rules + admin roles
- [ ] Deploy rules + functions to a real Firebase project
- [ ] Wire client SDK from storefront (extends V1)
