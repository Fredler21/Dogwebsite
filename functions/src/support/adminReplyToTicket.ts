import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';
import { sendEmail } from '../lib/email';
import { supportReply } from '../emails/templates';

export const adminReplyToTicket = onCall(async (req: CallableRequest) => {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
  const { ticketId, message } = (req.data ?? {}) as { ticketId?: string; message?: string };
  if (!ticketId || !message || message.length < 5) throw new HttpsError('invalid-argument', 'Bad input');

  const ref = db.collection('supportTickets').doc(ticketId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Ticket not found');
  const t = snap.data() as { customerEmail: string; subject: string };

  const tpl = supportReply({ ticketId, subject: t.subject, message });
  await sendEmail({
    to: t.customerEmail, ...tpl,
    templateName: 'supportReply',
    relatedRef: { collection: 'supportTickets', id: ticketId }
  });

  await ref.update({
    status: 'waiting_customer',
    updatedAt: Date.now(),
    lastAdminReply: { message, at: Date.now(), by: req.auth?.uid ?? null }
  });
  return { ok: true };
});
