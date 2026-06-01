import { onDocumentUpdated, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { sendEmail } from '../lib/email';
import { orderConfirmation, trackingNumber, refundConfirmation } from '../emails/templates';

export const onOrderPaid = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if (before.paymentStatus !== 'paid' && after.paymentStatus === 'paid') {
    const tpl = orderConfirmation({
      orderNumber: after.orderNumber,
      customerName: after.customerName,
      grandTotal: after.grandTotal,
      itemCount: (after.items ?? []).length
    });
    await sendEmail({
      to: after.customerEmail, ...tpl,
      templateName: 'orderConfirmation',
      relatedRef: { collection: 'orders', id: event.params.orderId }
    });
  }
});

export const onTrackingAdded = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if (!before.trackingNumber && after.trackingNumber) {
    const tpl = trackingNumber({
      orderNumber: after.orderNumber,
      carrier: after.trackingCarrier ?? 'Carrier',
      trackingNumber: after.trackingNumber
    });
    await sendEmail({
      to: after.customerEmail, ...tpl,
      templateName: 'trackingNumber',
      relatedRef: { collection: 'orders', id: event.params.orderId }
    });
  }
});

export const onOrderRefunded = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if (before.paymentStatus !== 'refunded' && after.paymentStatus === 'refunded') {
    const tpl = refundConfirmation({ orderNumber: after.orderNumber, amount: after.grandTotal });
    await sendEmail({
      to: after.customerEmail, ...tpl,
      templateName: 'refundConfirmation',
      relatedRef: { collection: 'orders', id: event.params.orderId }
    });
  }
});

export const onSupportTicketCreated = onDocumentCreated('supportTickets/{id}', async (event) => {
  const t = event.data?.data();
  if (!t) return;
  // TODO V6: trigger AI classification here.
});
