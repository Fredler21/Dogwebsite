import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';
import { isAutonomousActionAllowed } from '../lib/aiSafety';
import { logAi } from '../lib/aiLogger';

/**
 * Human-in-the-loop approval for AI-suggested actions.
 * Even with approval, money-touching actions stay BLOCKED from this path —
 * those use the dedicated, audited callables (processRefundRequest etc.).
 */
export const aiApproveAction = onCall(async (req: CallableRequest) => {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
  const { alertId, action } = (req.data ?? {}) as { alertId?: string; action?: string };
  if (!alertId || !action) throw new HttpsError('invalid-argument', 'alertId + action required');

  if (!isAutonomousActionAllowed(action))
    throw new HttpsError('failed-precondition', `Action "${action}" cannot be executed via AI path. Use the dedicated admin callable.`);

  const ref = db.collection('aiAlerts').doc(alertId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Alert not found');

  await ref.update({
    resolved: true, resolvedAt: Date.now(),
    resolvedBy: req.auth?.uid ?? null, resolvedAction: action
  });
  await logAi({
    task: 'approveAction',
    inputSummary: `alert=${alertId} action=${action}`,
    output: { ok: true },
    promptTokens: 0, completionTokens: 0,
    relatedRef: { collection: 'aiAlerts', id: alertId }
  });
  return { ok: true };
});
