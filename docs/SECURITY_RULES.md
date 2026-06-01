# Security Rules — V2 baseline

Plain-English version of `firestore.rules`. Strict mode + emulator tests land in V9.

| Collection | Public read | Customer access | Admin |
|---|---|---|---|
| `products` | only `status == active` | read | full |
| `categories` | only `status == active` | read | full |
| `customers/{uid}` | no | own doc only | full |
| `orders/{id}` | no | read own (uid or email match) | full; client cannot write payment/fulfillment status |
| `carts/{id}` | guest create | read/write own | full |
| `supportTickets` | create with validation | read own | full |
| `aiAlerts`, `aiLogs`, `auditLogs`, `suppliers`, `discounts` | no | no | full |
| `settings/public` | yes | yes | write |
| `settings/{other}` | no | no | full |

Key invariants:
- `paymentStatus` and `fulfillmentStatus` on orders are ONLY mutated by Cloud Functions (admin SDK bypasses rules).
- Customer must match either `request.auth.uid == order.customerId` OR `request.auth.token.email == order.customerEmail`.
- Support tickets validate `customerEmail`, `category`, `subject`, and `message` length (10-5000) at create time.
