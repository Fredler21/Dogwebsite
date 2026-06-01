import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { db } from '../lib/admin';
import { chat } from '../lib/ai';
import { logAi } from '../lib/aiLogger';
import { DAILY_REPORT_PROMPT } from '../lib/aiPrompts';

const OPENAI_KEY = defineSecret('OPENAI_API_KEY');
const DAY_MS = 86_400_000;

export const aiDailyReport = onSchedule(
  { schedule: 'every day 09:00', timeZone: 'America/Toronto', secrets: [OPENAI_KEY] },
  async () => {
    const end = Date.now();
    const start = end - DAY_MS;

    const ordersSnap = await db.collection('orders')
      .where('createdAt', '>=', start).where('createdAt', '<', end).get();
    const orders = ordersSnap.docs.map(d => d.data());
    const revenue = orders.filter(o => o.paymentStatus === 'paid')
      .reduce((s, o) => s + (o.grandTotal ?? 0), 0);
    const refunds = orders.filter(o => o.paymentStatus === 'refunded').length;

    const ticketsSnap = await db.collection('supportTickets')
      .where('createdAt', '>=', start).where('createdAt', '<', end).get();

    const productCounts: Record<string, number> = {};
    for (const o of orders) {
      for (const item of (o.items ?? []) as Array<{ productId: string; quantity: number }>) {
        productCounts[item.productId] = (productCounts[item.productId] ?? 0) + item.quantity;
      }
    }
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none';

    const userPrompt = JSON.stringify({
      orderCount: orders.length,
      paidOrders: orders.filter(o => o.paymentStatus === 'paid').length,
      revenueCents: revenue,
      refunds,
      ticketsOpened: ticketsSnap.size,
      topProduct
    });

    const r = await chat(DAILY_REPORT_PROMPT, userPrompt, { temperature: 0.3 });

    await db.collection('aiReports').add({
      type: 'daily',
      forDate: start,
      summary: r.text,
      metrics: JSON.parse(userPrompt),
      createdAt: Date.now()
    });

    await logAi({
      task: 'dailyReport',
      inputSummary: userPrompt,
      output: { summary: r.text },
      promptTokens: r.promptTokens,
      completionTokens: r.completionTokens
    });
  }
);
