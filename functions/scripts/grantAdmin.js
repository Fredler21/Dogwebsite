/**
 * One-time script — grants the `admin: true` custom claim to a user.
 *
 * Usage:
 *   cd functions
 *   node scripts/grantAdmin.js pierrelouisfredler@gmail.com
 *
 * Authentication: this uses Application Default Credentials.
 * Run `firebase login` first (interactive) OR set GOOGLE_APPLICATION_CREDENTIALS
 * to a service account key path.
 */
const admin = require('firebase-admin');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/grantAdmin.js <email>');
    process.exit(1);
  }

  const projectId = process.env.GCLOUD_PROJECT
    || process.env.GOOGLE_CLOUD_PROJECT
    || 'dogvanta-bc5e4';

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId
  });

  const user = await admin.auth().getUserByEmail(email);
  const before = user.customClaims || {};
  await admin.auth().setCustomUserClaims(user.uid, { ...before, admin: true });
  await admin.firestore().collection('users').doc(user.uid).set(
    { admin: true, email, updatedAt: Date.now() },
    { merge: true }
  );
  console.log(`Granted admin to ${email} (uid=${user.uid})`);
  console.log('IMPORTANT: sign out and sign back in for the claim to refresh.');
}

main().catch(e => { console.error(e); process.exit(1); });
