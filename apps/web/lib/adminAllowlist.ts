// Single source of truth for admin allowlist (client-side gate only).
// Authoritative check is the Firebase custom claim `admin === true` enforced
// by Firestore security rules. Keep this list and the `SUPER_ADMIN_EMAIL`
// secret on the backend in sync.
export const ALLOWED_ADMIN_EMAILS: readonly string[] = [
  'pierrelouisfredler@gmail.com',
];

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}
