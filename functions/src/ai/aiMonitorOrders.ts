import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { db } from '../lib/admin';
import { chat, parseJson } from '../lib/ai';
import { logAi } from '../lib/aiLogger';
import { ORDER_MONITOR_PROMPT } from '../lib/aiPrompts';

const OPENAI_KEY = defineSecret('OPENAI_API_KEY');
const DAY_MS = 86_400_000;

interface OrderSummary { orderId: string; status: string; ageDays: number; trackingNumber: string | null; grandTotal: number; }
interface AlertOutput { alerts: Array<{ orderId: string; reason: string; severity: 'info'|'warning'|'critical'; suggestedAction: string }>; }

export const aiMonitorOrders = onSchedule(
  { schedule: 'every 6 hours', secrets: [OPENAI_KEY], timeoutSeconds: 300 },
  async () => {
    const cutoff = Date.now() - 30 * DAY_MS;
    const snap = await db.collection('orders')
      .where('createdAt', '>=', cutoff)
      .where('paymentStatus', '==', 'paid')
      .limit(200)
      .get();

    const summaries: OrderSummary[] = snap.docs.map(d => {
      const o = d.data();
      return {
        orderId: d.id,
        status: o.fulfillmentStatus ?? 'unknown',
        ageDays: Math.floor((Date.now() - (o.createdAt ?? Date.now())) / DAY_MS),
        trackingNumber: o.trackingNumber ?? null,
        grandTotal: o.grandTotal ?? 0
      };
    });

    // Pre-filter to obviously risky candidates (saves tokens).
    const candidates = summaries.filter(s =>
      (s.status === 'pending' && s.ageDays >= 3) ||
      (!s.trackingNumber && s.ageDays >= 5) ||
      (s.status !== 'delivered' && s.ageDays >= 14)
    );
    if (candidates.length === 0) return;

    const r = await chat(ORDER_MONITOR_PROMPT, JSON.stringify(candidates), { json: true });
    const parsed = parseJson<AlertOutput>(r.text);

    if (parsed?.alerts?.length) {
      const batch = db.batch();
      for (const a of parsed.alerts) {
        const ref = db.collection('aiAlerts').doc();
        batch.set(ref, {
          ...a, type: 'order_monitor', resolved: false, createdAt: Date.now()
        });
      }
      await batch.commit();
    }

    await logAi({
      task: 'monitorOrders',
      inputSummary: `${candidates.length} risky candidates of ${summaries.length} orders`,
      output: parsed ?? { error: 'parse_failed' },
      promptTokens: r.promptTokens,
      completionTokens: r.completionTokens
    });
  }
);
