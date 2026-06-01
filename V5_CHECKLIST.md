# V5 — Customer Communication — Definition of Done

- [x] Resend email wrapper with `/emailLogs` write
- [x] 7 email templates: orderConfirmation, trackingNumber, refundConfirmation, supportReply, abandonedCart, delayedShipmentApology, reviewRequest, supplierReminder
- [x] Firestore triggers: onOrderPaid → confirmation, onTrackingAdded → tracking email, onOrderRefunded → refund email
- [x] `createSupportTicket` callable with strict validation
- [x] `adminReplyToTicket` callable (admin-only) that sends email + updates ticket
- [x] Contact form page with category dropdown
- [x] Support center landing page
- [x] Admin support placeholder (full inbox in V3 admin branch + AI in V6)
- [x] Email setup + support workflow docs
- [ ] Wire abandoned cart trigger (V8 scheduler)
- [ ] Hook AI classification into onSupportTicketCreated (V6)
