# V7 — Supplier Workflow — Definition of Done

- [x] `/suppliers` collection + `Supplier` type
- [x] `/supplierOrders` collection + `SupplierOrder` type
- [x] Admin callables: createSupplier, updateSupplier, setSupplierActive
- [x] Admin callables: assignSupplierToOrder, updateSupplierOrderStatus
- [x] Shipped status propagates tracking → /orders (triggers V5 customer email)
- [x] Delivered + issue states sync up to parent order
- [x] Admin pages: suppliers list, new supplier form, scorecards placeholder
- [x] `SupplierFulfillmentPanel` component for order detail page
- [x] Docs: SUPPLIER_WORKFLOW, SUPPLIER_INTEGRATION
- [ ] Wire panel into V3 admin order detail (V8 integration step)
- [ ] CJ Dropshipping API integration (future)
- [ ] Scorecards computation (V10 scheduled job)
