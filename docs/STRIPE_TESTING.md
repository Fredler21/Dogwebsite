# Stripe Testing

## Test card numbers

| Scenario | Card |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Requires 3DS auth | `4000 0025 0000 3155` |
| Declined | `4000 0000 0000 9995` |
| Insufficient funds | `4000 0000 0000 9995` |

Use any future expiry, any 3-digit CVC, any ZIP.

## Test full flow

1. Add product to cart on storefront.
2. Click Checkout → enter email → redirect to Stripe.
3. Complete payment with `4242...`.
4. Watch local webhook output — `checkout.session.completed` fires.
5. Verify `/orders/{id}` in Firestore: `paymentStatus` flips to `paid`.
6. Trigger a refund from Stripe Dashboard → verify `charge.refunded` updates the order.

## Idempotency

The webhook checks `paymentStatus === 'pending'` before flipping to `paid`, so duplicate event delivery from Stripe won't double-process. All events are written to `/auditLogs` with the event ID for traceability.
