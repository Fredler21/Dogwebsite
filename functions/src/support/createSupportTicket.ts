import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';
import { isEmail, isEnum, isNonEmptyString, sanitizeText } from '../lib/validation';

const CATEGORIES = ['tracking','refund','return','damaged','wrong_item','payment','general'] as const;

export const createSupportTicket = onCall(async (req: CallableRequest) => {
  const { customerEmail, category, subject, message, orderId } = (req.data ?? {}) as Record<string, unknown>;

  if (!isEmail(customerEmail)) throw new HttpsError('invalid-argument', 'Valid email required');
  if (!isEnum(category, CATEGORIES)) throw new HttpsError('invalid-argument', 'Invalid category');
  if (!isNonEmptyString(subject, 200)) throw new HttpsError('invalid-argument', 'Subject required');
  if (typeof message !== 'string' || message.length < 10 || message.length > 5000) {
    throw new HttpsError('invalid-argument', 'Message must be 10-5000 chars');
  }

  // TODO V9: rate limit by IP / email.
  const now = Date.now();
  const ref = await db.collection('supportTickets').add({
    customerEmail,
    category,
    subject: sanitizeText(subject as string),
    message: sanitizeText(message),
    orderId: orderId ?? null,
    priority: 'medium',
    status: 'open',
    createdAt: now,
    updatedAt: now
  });

  return { ok: true, ticketId: ref.id };
});
