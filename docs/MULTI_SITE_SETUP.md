# Multi-Site Setup

We run multiple storefronts off the same monorepo: Allyoucanuse (auto), a pet site (Pawkind), a home-goods site (Homely).

## How it works

- **One codebase, multiple Hosting targets.**
- Each site gets a Firebase Hosting target in `firebase.json`:

```json
"hosting": [
  { "target": "allyoucanuse", "public": "apps/web/.next" },
  { "target": "pawkind",      "public": "apps/web/.next" },
  { "target": "homely",       "public": "apps/web/.next" }
]
```

- Each store has a `/stores/{storeId}` record with: `domain`, `themePreset` (`car|pet|home`), `brandName`, `categorySlugs`, `featuredProductIds`.
- Next.js middleware reads the request `Host` header, looks up the store, and injects `storeId` into request context.
- `ThemeProvider preset={...}` swaps colors + logo without redeploying.
- Products belong to one or more stores via `product.storeIds[]`.

## Adding a new store

1. Create the doc: `/stores/{storeId}` with the required fields.
2. Add a Hosting target: `firebase target:apply hosting <storeId> <site-id>`.
3. Append the target to `firebase.json`.
4. Deploy: `firebase deploy --only hosting:<storeId>`.
5. Point DNS at the new Hosting site.

## Shared backend

All sites share the same Firestore, Functions, Auth, and Stripe account. The admin panel (`/admin`) shows data for all stores, filterable by `storeId`.
