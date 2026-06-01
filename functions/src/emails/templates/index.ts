import { SUPPORT_EMAIL } from '../../lib/email';

function footer(): string {
  return `<hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0"/>
<p style="font-size:12px;color:#64748b">Need help? Email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>`;
}

export function orderConfirmation(o: { orderNumber: string; customerName?: string; grandTotal: number; itemCount: number }) {
  const total = `$${(o.grandTotal / 100).toFixed(2)}`;
  const subject = `Order ${o.orderNumber} confirmed`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px;margin:0 0 12px">Thanks${o.customerName ? ', ' + o.customerName : ''}!</h1>
<p>We received your order <strong>${o.orderNumber}</strong>.</p>
<p>Items: ${o.itemCount}<br/>Total: <strong>${total}</strong></p>
<p>We will email tracking as soon as your order ships.</p>
${footer()}
</div>`;
  const text = `Order ${o.orderNumber} confirmed. Total ${total}. We will email tracking when it ships. Support: ${SUPPORT_EMAIL}`;
  return { subject, html, text };
}

export function trackingNumber(o: { orderNumber: string; carrier: string; trackingNumber: string; trackingUrl?: string }) {
  const subject = `Your order ${o.orderNumber} has shipped`;
  const link = o.trackingUrl ? `<a href="${o.trackingUrl}">${o.trackingNumber}</a>` : o.trackingNumber;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px">Your order is on the way</h1>
<p>Order <strong>${o.orderNumber}</strong> shipped via <strong>${o.carrier}</strong>.</p>
<p>Tracking number: ${link}</p>
${footer()}
</div>`;
  const text = `Order ${o.orderNumber} shipped via ${o.carrier}. Tracking: ${o.trackingNumber}.`;
  return { subject, html, text };
}

export function refundConfirmation(o: { orderNumber: string; amount: number }) {
  const amt = `$${(o.amount / 100).toFixed(2)}`;
  const subject = `Refund processed for ${o.orderNumber}`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px">Refund processed</h1>
<p>We refunded <strong>${amt}</strong> for order ${o.orderNumber}. It should appear on your statement in 5-10 business days.</p>
${footer()}
</div>`;
  return { subject, html, text: `Refund of ${amt} processed for order ${o.orderNumber}.` };
}

export function supportReply(o: { ticketId: string; subject: string; message: string }) {
  const subject = `Re: ${o.subject}`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<p>${o.message.replace(/\n/g, '<br/>')}</p>
${footer()}
<p style="font-size:11px;color:#94a3b8">Ticket ${o.ticketId}</p>
</div>`;
  return { subject, html, text: o.message };
}

export function abandonedCart(o: { itemCount: number; resumeUrl: string }) {
  const subject = 'You left something in your cart';
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px">Still interested?</h1>
<p>You have ${o.itemCount} item${o.itemCount === 1 ? '' : 's'} waiting in your cart.</p>
<p><a href="${o.resumeUrl}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Resume checkout</a></p>
${footer()}
</div>`;
  return { subject, html, text: `Your cart has ${o.itemCount} item(s). Resume: ${o.resumeUrl}` };
}

export function delayedShipmentApology(o: { orderNumber: string; etaDays: number }) {
  const subject = `Update on your order ${o.orderNumber}`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px">A short delay</h1>
<p>Your order ${o.orderNumber} is taking longer than expected. New estimated delivery: ~${o.etaDays} business days.</p>
<p>Thanks for your patience.</p>
${footer()}
</div>`;
  return { subject, html, text: `Order ${o.orderNumber} delayed. New ETA: ~${o.etaDays} business days.` };
}

export function reviewRequest(o: { orderNumber: string; reviewUrl: string }) {
  const subject = `How was your order ${o.orderNumber}?`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
<h1 style="font-size:20px">Leave a quick review?</h1>
<p>If your order ${o.orderNumber} arrived in good shape, a short review helps other shoppers.</p>
<p><a href="${o.reviewUrl}">Leave a review</a></p>
${footer()}
</div>`;
  return { subject, html, text: `Review your order at ${o.reviewUrl}` };
}

export function supplierReminder(o: { orderNumber: string; daysOpen: number }) {
  const subject = `[Action] Order ${o.orderNumber} still unfulfilled (${o.daysOpen}d)`;
  const html = `<p>Order ${o.orderNumber} has been awaiting supplier fulfillment for ${o.daysOpen} day(s).</p>`;
  return { subject, html, text: `Order ${o.orderNumber} pending ${o.daysOpen}d.` };
}
