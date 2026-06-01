# V9 — Security Hardening — Definition of Done

- [x] Strict firestore.rules with field-level validation on /supportTickets
- [x] Privilege escalation guard on /users updates
- [x] Rate-limit helper (Firestore counter-based)
- [x] Audit log helper + /auditLogs collection (server-only writes)
- [x] RBAC functions: setAdminClaim, listAdmins (super-admin only)
- [x] ErrorBoundary component
- [x] ConsentBanner (essential vs all cookies, persisted to localStorage)
- [x] Nightly backup scheduled function + GitHub Actions verifier
- [x] Gitleaks secret-scanning workflow
- [x] Docs: SECURITY_REVIEW, INCIDENT_RESPONSE, OWASP_CHECKLIST, ADMIN_2FA, SECRETS_SCANNING
- [ ] CSP + HSTS headers in next.config.js (V10 multi-store branch)
- [ ] Dependabot config (manual one-liner — keep out of PRs)
- [ ] requireAdminMfa enforcement (depends on Firebase Auth MFA setup)
