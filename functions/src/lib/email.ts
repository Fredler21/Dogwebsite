import { Resend } from 'resend';
import { defineSecret } from 'firebase-functions/params';

const RESEND_KEY = defineSecret('RESEND_API_KEY');

export const FROM_EMAIL = process.env.FROM_EMAIL ?? 'support@dogvanta.com';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? 'support@dogvanta.com';

let _client: Resend | null = null;
function client(): Resend {
  if (_client) return _client;
  const key = process.env.RESEND_API_KEY ?? RESEND_KEY.value();
  if (!key) throw new Error('RESEND_API_KEY not set');
  _client = new Resend(key);
  return _client;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  /** Optional logical template name — used for analytics / suppression, not by Resend. */
  templateName?: string;
  /** Optional reference to the entity this email relates to (order, ticket, etc.). */
  relatedRef?: { collection: string; id: string };
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  await client().emails.send({
    from: input.from ?? FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    reply_to: input.replyTo
  });
}
