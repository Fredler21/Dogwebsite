# Supplier Workflow

## Lifecycle

```
order paid
   │
   ▼
admin assigns supplier  ── assignSupplierToOrder ──►  /supplierOrders (status: awaiting)
   │                                                       │
   ▼                                                       ▼
supplier sources stock                          admin marks "sourced"
   │
   ▼
supplier ships  ──► admin enters tracking + marks "shipped"
   │                          │
   │                          ▼
   │       order.trackingNumber populated → V5 trigger emails the customer
   ▼
delivered  ──► admin marks "delivered"  ──► supplier scorecard counter bumped
```

## Statuses (`/supplierOrders.status`)

`awaiting` → `sourced` → `shipped` → `delivered`
plus `cancelled`, `issue` (escalates the parent order to `fulfillmentStatus: issue`)

## Validation rules

- `assignSupplierToOrder` rejects inactive suppliers.
- `updateSupplierOrderStatus` requires `trackingNumber` when status becomes `shipped`.
- All callables require `request.auth.token.admin === true`.

## Data model

- `/suppliers/{id}` — supplier master record (see `supplierTypes.ts`).
- `/supplierOrders/{id}` — per-order fulfillment record linking customer order ↔ supplier.
- `/orders/{id}.supplierOrderId` + `supplierId` set on assignment.

## Communication

`supplierReminder` email template (V5) is used by the scheduled `nudgeStuckSupplierOrders` function (V8) when a `/supplierOrders` doc has `status in [awaiting, sourced]` and `ageDays >= 3`.
