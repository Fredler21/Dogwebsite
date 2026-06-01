/**
 * AI safety gates: decide whether the assistant may act autonomously and
 * whether a support thread should be escalated to a human.
 *
 * Automation level (env or doc): 'manual' | 'suggest' | 'autonomous'
 *   manual     – AI may only read; all actions require admin approval.
 *   suggest    – AI may draft actions; admin must approve.
 *   autonomous – AI may execute pre-approved low-risk actions directly.
 */

const LEVEL = (process.env.AI_AUTOMATION_LEVEL_DEFAULT ?? 'manual') as 'manual' | 'suggest' | 'autonomous';

const AUTONOMOUS_ALLOWED = new Set<string>([
  'sendOrderUpdate',
  'tagSupportTicket',
  'requestTrackingFromSupplier'
]);

const HIGH_RISK = new Set<string>(['refund', 'cancelOrder', 'changePrice', 'deleteRecord']);

export function isAutonomousActionAllowed(action: string): boolean {
  if (LEVEL !== 'autonomous') return false;
  if (HIGH_RISK.has(action)) return false;
  return AUTONOMOUS_ALLOWED.has(action);
}

export interface EscalateContext {
  message: string;
  orderValue?: number;
  history?: number;
}

const HIGH_RISK_PHRASES = ['lawyer', 'attorney', 'chargeback', 'refund', 'fraud', 'stolen', 'never received', 'broken', 'wrong item', 'unsafe', 'allergy', 'injury'];

export interface EscalateDecision {
  escalate: boolean;
  reasons: string[];
}

/** Decide whether a support thread should be routed to a human admin. */
export function shouldEscalate(ctx: EscalateContext): EscalateDecision {
  const msg = (ctx.message ?? '').toLowerCase();
  const reasons: string[] = [];
  for (const p of HIGH_RISK_PHRASES) {
    if (msg.includes(p)) { reasons.push(`phrase:${p}`); break; }
  }
  if ((ctx.orderValue ?? 0) >= 20000) reasons.push('high_value_order');
  if ((ctx.history ?? 0) >= 3) reasons.push('long_history');
  return { escalate: reasons.length > 0, reasons };
}
