import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';

const CATEGORIES = ['tracking','refund','return','damaged','wrong_item','payment','general'] as const;

export const createSupportTicket = onCall(async (req: CallableRequest) => {
  const { customerEmail, category, subject, message, orderId } = (req.data ?? {}) as Record<string, unknown>;
  if (typeof customerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
    throw new HttpsError('invalid-argument', 'Valid email required');
  if (typeof category !== 'string' || !CATEGORIES.includes(category as typeof CATEGORIES[number]))
    throw new HttpsError('invalid-argument', 'Invalid category');
  if (typeof subject !== 'string' || subject.trim().length === 0 || subject.length > 200)
    throw new HttpsError('invalid-argument', 'Subject required');
  if (typeof message !== 'string' || message.length < 10 || message.length > 5000)
    throw new HttpsError('invalid-argument', 'Message must be 10-5000 chars');

  const now = Date.now();
  const ref = await db.collection('supportTickets').add({
    customerEmail,
    category,
    subject: subject.replace(/<[^>]*>/g, '').trim(),
    message: message.replace(/<[^>]*>/g, '').trim(),
    orderId: typeof orderId === 'string' ? orderId : null,
    priority: 'medium',
    status: 'open',
    createdAt: now,
    updatedAt: now
  });
  return { ok: true, ticketId: ref.id };
});
