import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../lib/admin';

/**
 * Nightly Firestore export to the configured backup bucket.
 * Cloud Scheduler triggers this; the actual export uses the Admin SDK
 * googleapis client (added to deps when wiring). Here we stub the call
 * shape and record a backup log.
 *
 * Set BACKUP_BUCKET = "gs://allyoucanuse-backups".
 */
export const nightlyBackup = onSchedule({ schedule: 'every day 02:30', timeZone: 'America/Toronto' }, async () => {
  const bucket = process.env.BACKUP_BUCKET;
  if (!bucket) {
    console.warn('BACKUP_BUCKET not set — skipping backup');
    return;
  }
  // TODO: invoke firestore.projects.databases.exportDocuments via googleapis.
  await db.collection('backupLogs').add({
    bucket, startedAt: Date.now(), status: 'queued'
  });
});
