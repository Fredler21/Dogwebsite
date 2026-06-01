# Supplier Integration Guide

## Supported platforms (today)

| Platform | Notes |
|---|---|
| CJ Dropshipping | Manual order paste today; API integration on roadmap. |
| AliExpress | Manual order paste; AE Dropshipping API requires partner approval. |
| Private supplier | Email-based workflow using `supplierReminder` template. |
| Other | Generic — manual everything. |

## Adding a new supplier

1. Admin → **Suppliers → New supplier**.
2. Fill in name, contact email, platform, region, default lead time (days).
3. Save. Supplier appears in the assignment dropdown on order detail.

## Adding a new platform integration

1. Add the platform key to `PLATFORMS` in `functions/src/suppliers/supplierCrud.ts`.
2. Create `functions/src/suppliers/integrations/<platform>.ts` exporting `placeOrder(supplierOrder)` and `pollStatus(supplierOrder)`.
3. Wire it into `assignSupplierToOrder` behind a `if (supplier.platform === '<platform>')` branch.
4. Store API credentials as Firebase secrets — never in code or env files.

## Security

- Supplier records are admin-readable only (enforced in `firestore.rules`).
- Customer-facing pages never expose `supplierId`, `costCents`, or any supplier metadata.
- Per PRD section 14: customers must never see supplier identity.
