import { onDocumentCreated } from 'firebase-functions/v2/firestore';

// Fires when a new order document is created. V5 emails + V6 AI risk scoring hook in here.
export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data?.data();
  if (!order) return;
  // TODO V5: send admin alert, queue confirmation email.
  // TODO V6: AI risk scoring + supplier check.
});
