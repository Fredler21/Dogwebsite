# V0 — Definition of Done

- [x] Next.js 14 + TypeScript + Tailwind scaffolded under `apps/web`
- [x] Firebase config files (`firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`)
- [x] `.env.example` lists every env var (no secrets committed)
- [x] TypeScript interfaces for Product, Category, Customer, Cart, CartItem, Order, Supplier, SupportTicket, Discount, AIAlert, AILog, StoreSettings
- [x] Placeholder routes: home, shop, products/[slug], cart, checkout, order-success, track-order, support, admin, policies
- [x] `apps/web/lib/firebaseClient.ts` reads env vars (no hardcoded keys)
- [x] `functions/` workspace with TypeScript build setup
- [x] README explains stack, layout, local dev, phase roadmap
- [ ] `npm install` runs successfully (run after cloning)
- [ ] `npm run dev` boots without errors

No payment, AI, supplier, or email automation is active yet — those land in later phases.
