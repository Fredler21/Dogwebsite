# Admin Roles

Admin access is gated by a Firebase Auth **custom claim**: `{ admin: true }`.

## Bootstrap the first admin

```bash
# Using firebase-admin from a one-off Node script:
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
admin.auth().getUserByEmail(process.env.SUPER_ADMIN_EMAIL)
  .then(u => admin.auth().setCustomUserClaims(u.uid, { admin: true }))
  .then(() => console.log('ok'));
"
```

Or via gcloud CLI / Firebase console manually. After setting the claim, the user must sign out and back in for the new token to take effect.

## Granting/revoking admin

V9 adds Cloud Functions `setAdminClaim`, `revokeAdmin`, `listAdmins` that can only be invoked by an existing super admin.

## Rule reference

Rules check `request.auth.token.admin == true`. See `firestore.rules` and `storage.rules`.
