# OWASP Top 10 Checklist

| # | Risk | Mitigation in this repo |
|---|---|---|
| A01 | Broken Access Control | Firestore default-deny + `isAdmin()` / `isOwner()` rules. Admin claim only settable by super admin. Privilege escalation guard on `/users` updates. |
| A02 | Cryptographic Failures | TLS via Firebase Hosting / Vercel. No passwords stored (Firebase Auth). Stripe Checkout handles card data. |
| A03 | Injection | All user input goes through validation helpers; tickets/messages have HTML stripped. Firestore SDK parameterizes everything. |
| A04 | Insecure Design | Refunds/cancels/price changes never autonomous (V6 `aiSafety.ts`). Server-side price recompute in Stripe checkout (V4). |
| A05 | Security Misconfiguration | Strict CSP headers (to add in V10 multi-store), HSTS via Firebase Hosting, secrets via Secret Manager, gitleaks CI. |
| A06 | Vulnerable & Outdated Components | `npm audit` in CI (TODO add workflow); Dependabot on the repo. |
| A07 | Identification & Authentication Failures | Firebase Auth + admin 2FA enforced. Rate limit on support ticket create. |
| A08 | Software & Data Integrity Failures | Stripe webhook verifies `Stripe-Signature` (V4). All packages from npm registry, lockfile committed. |
| A09 | Security Logging & Monitoring Failures | `/auditLogs` (server-only), `/aiLogs`, `/emailLogs`, Cloud Functions logs. |
| A10 | SSRF | We do not make outbound HTTP to user-supplied URLs anywhere except known SDKs (Stripe, OpenAI, Resend). |
