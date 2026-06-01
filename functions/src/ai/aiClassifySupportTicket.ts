import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { db } from '../lib/admin';
import { chat, parseJson } from '../lib/ai';
import { logAi } from '../lib/aiLogger';
import { shouldEscalate } from '../lib/aiSafety';
import { SUPPORT_CLASSIFY_PROMPT } from '../lib/aiPrompts';

const OPENAI_KEY = defineSecret('OPENAI_API_KEY');

interface Classification {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  summary: string;
  suggestedReply: string;
  needsHumanReview: boolean;
  reason: string | null;
}

export const aiClassifySupportTicket = onDocumentCreated(
  { document: 'supportTickets/{id}', secrets: [OPENAI_KEY] },
  async (event) => {
    const t = event.data?.data();
    if (!t) return;
    const id = event.params.id;

    let orderValue: number | undefined;
    if (typeof t.orderId === 'string' && t.orderId) {
      const o = await db.collection('orders').doc(t.orderId).get();
      orderValue = (o.data()?.grandTotal as number | undefined);
    }
    const history = (await db.collection('supportTickets')
      .where('customerEmail', '==', t.customerEmail).count().get()).data().count;

    const safety = shouldEscalate({ message: t.message ?? '', orderValue, history });

    const userPrompt = JSON.stringify({
      subject: t.subject, message: t.message, category: t.category,
      hasOrder: !!t.orderId, orderValue: orderValue ?? null, priorTickets: history
    });

    let parsed: Classification | null = null;
    let usage = { promptTokens: 0, completionTokens: 0 };
    try {
      const r = await chat(SUPPORT_CLASSIFY_PROMPT, userPrompt, { json: true });
      usage = { promptTokens: r.promptTokens, completionTokens: r.completionTokens };
      parsed = parseJson<Classification>(r.text);
    } catch (e) {
      await logAi({
        task: 'classifySupportTicket', inputSummary: t.subject ?? '', output: { error: String(e) },
        ...usage, relatedRef: { collection: 'supportTickets', id }, flagged: true, reason: 'ai_error'
      });
      return;
    }

    if (!parsed) {
      await logAi({
        task: 'classifySupportTicket', inputSummary: t.subject ?? '', output: { error: 'parse_failed' },
        ...usage, relatedRef: { collection: 'supportTickets', id }, flagged: true, reason: 'parse_error'
      });
      return;
    }

    const needsReview = parsed.needsHumanReview || safety.escalate;
    await db.collection('supportTickets').doc(id).update({
      aiCategory: parsed.category,
      aiPriority: parsed.priority,
      aiSummary: parsed.summary,
      aiSuggestedReply: parsed.suggestedReply,
      aiNeedsHumanReview: needsReview,
      aiEscalationReasons: safety.reasons,
      aiProcessedAt: Date.now()
    });

    await logAi({
      task: 'classifySupportTicket',
      inputSummary: `${t.subject} — ${(t.message ?? '').slice(0, 200)}`,
      output: parsed,
      ...usage,
      relatedRef: { collection: 'supportTickets', id },
      flagged: needsReview,
      reason: needsReview ? safety.reasons.join(',') || parsed.reason || 'ai_flag' : undefined
    });
  }
);
