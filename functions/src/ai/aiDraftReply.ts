import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { db } from '../lib/admin';
import { chat, parseJson } from '../lib/ai';
import { logAi } from '../lib/aiLogger';
import { SUPPORT_CLASSIFY_PROMPT } from '../lib/aiPrompts';

const OPENAI_KEY = defineSecret('OPENAI_API_KEY');

/**
 * Re-draft a support reply on demand. Admin can call this to regenerate
 * the suggested response (e.g. after editing the ticket category).
 * Output is written back to the ticket as `aiSuggestedReply`; nothing is sent.
 */
export const aiDraftReply = onCall(
  { secrets: [OPENAI_KEY] },
  async (req: CallableRequest) => {
    if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
    const { ticketId, hint } = (req.data ?? {}) as { ticketId?: string; hint?: string };
    if (!ticketId) throw new HttpsError('invalid-argument', 'ticketId required');

    const ref = db.collection('supportTickets').doc(ticketId);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Ticket not found');
    const t = snap.data() as { subject: string; message: string; category?: string };

    const userPrompt = JSON.stringify({
      subject: t.subject, message: t.message,
      category: t.category, adminHint: hint ?? null
    });
    const r = await chat(SUPPORT_CLASSIFY_PROMPT, userPrompt, { json: true });
    const parsed = parseJson<{ suggestedReply?: string }>(r.text);
    const draft = parsed?.suggestedReply ?? '';

    await ref.update({ aiSuggestedReply: draft, aiDraftedAt: Date.now() });
    await logAi({
      task: 'draftReply',
      inputSummary: t.subject, output: { draft },
      promptTokens: r.promptTokens, completionTokens: r.completionTokens,
      relatedRef: { collection: 'supportTickets', id: ticketId }
    });
    return { ok: true, draft };
  }
);
