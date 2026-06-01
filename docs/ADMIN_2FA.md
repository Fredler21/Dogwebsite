# Admin 2FA (required)

All admin accounts MUST have 2FA enabled. Firebase Auth supports SMS and TOTP (preferred).

## Enabling TOTP for an admin

1. The admin signs in to their account on `/admin/login`.
2. From the admin profile menu → **Security → Enable 2FA**.
3. Scan the QR code with Google Authenticator / 1Password / Authy.
4. Enter the 6-digit code to confirm.
5. Store the backup codes in 1Password.

## Enforcement (server-side)

A Firebase Function `requireAdminMfa` (TODO) inspects `request.auth.token.firebase.sign_in_second_factor` on every admin callable. Calls without a verified second factor are rejected with `permission-denied`.

## Lost device

The super admin can disable 2FA for a user via the Firebase console → Authentication → user → "Remove second factor". This action is logged automatically by Firebase Auth.
