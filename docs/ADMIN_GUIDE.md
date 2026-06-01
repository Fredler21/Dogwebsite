# Admin Guide

## Bootstrap

1. Sign up a Firebase Auth account with your admin email.
2. Grant the `admin: true` custom claim (see `docs/ADMIN_ROLES.md` in V2 branch).
3. Sign out, sign back in at `/admin/login`.
4. `RequireAdmin` will let you through.

## Pages

| Path | Purpose | Phase |
|---|---|---|
| `/admin` | Overview KPIs | V3 (shell), V8 (live data) |
| `/admin/orders` | Order list + detail | V3 |
| `/admin/products` | Product CRUD | V3 |
| `/admin/customers` | Customer directory | V3 |
| `/admin/suppliers` | Supplier mgmt | V7 |
| `/admin/support` | Ticket inbox | V5 |
| `/admin/discounts` | Discount codes | V3 |
| `/admin/analytics` | Funnel + revenue | V8 |
| `/admin/ai` | AI alerts + reports | V6 |
| `/admin/settings` | Store config | V3 |
