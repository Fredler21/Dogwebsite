/*
 * One-off bootstrap: grant the Firebase Auth `admin` custom claim by email.
 *
 * This is how you create your FIRST admin (the deployed setAdminClaim function
 * requires an existing super-admin to call it — chicken-and-egg). This script
 * uses a service-account key directly, so it needs no prior admin.
 *
 * Steps:
 *   1. Sign in once at /admin/login with the Google account you want as admin,
 *      so a Firebase Auth user actually exists for that email.
 *   2. Firebase console → ⚙ Project settings → Service accounts →
 *      "Generate new private key". Save the JSON somewhere OUTSIDE the repo
 *      (it's gitignored anyway, but keep it safe — it's a full-access key).
 *   3. From the functions/ folder, run:
 *
 *      PowerShell:
 *        $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *        node scripts/grant-admin.js you@example.com
 *
 *      Bash:
 *        GOOGLE_APPLICATION_CREDENTIALS="/c/path/to/serviceAccount.json" \
 *          node scripts/grant-admin.js you@example.com
 *
 *   4. Sign out and back in — custom claims only refresh on a new sign-in.
 *
 * To revoke instead of grant, pass `false` as a second arg:
 *   node scripts/grant-admin.js you@example.com false
 */
const admin = require('firebase-admin');

const email = process.argv[2];
const grant = process.argv[3] !== 'false';

if (!email) {
  console.error('Usage: node scripts/grant-admin.js <email> [true|false]');
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('❌ Set GOOGLE_APPLICATION_CREDENTIALS to your service-account JSON first (see header).');
  process.exit(1);
}

admin.initializeApp(); // reads GOOGLE_APPLICATION_CREDENTIALS

(async () => {
  const user = await admin.auth().getUserByEmail(email);
  const claims = user.customClaims || {};
  await admin.auth().setCustomUserClaims(user.uid, { ...claims, admin: grant });
  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ admin: grant, email, updatedAt: Date.now() }, { merge: true });
  console.log(
    `✅ ${grant ? 'Granted' : 'Revoked'} admin for ${email} (uid: ${user.uid}).`,
  );
  console.log('   Sign out and back in for the change to take effect.');
  process.exit(0);
})().catch((e) => {
  console.error('❌', e.message);
  if (/no user record/i.test(e.message)) {
    console.error('   → Sign in once at /admin/login with this email first, then re-run.');
  }
  process.exit(1);
});
