import { db } from './admin';

export interface AuditRecord {
  actor: string;
  action: string;
  target?: { collection: string; id: string };
  meta?: Record<string, unknown>;
  before?: unknown;
  after?: unknown;
  [key: string]: unknown;
}

/** Write an immutable audit log entry. */
export async function audit(rec: AuditRecord): Promise<void> {
  await db.collection('auditLog').add({
    ...rec,
    at: Date.now()
  });
}
