# Secrets Scanning

## What is scanned

- All branches and PRs via Gitleaks (`.github/workflows/secret-scan.yml`).
- Pre-commit hook recommended (see below).

## Pre-commit hook

```bash
# .git/hooks/pre-commit
#!/usr/bin/env bash
gitleaks protect --staged --no-banner --redact || {
  echo "Gitleaks found secrets in your staged changes. Aborting commit."
  exit 1
}
```

## Secret inventory

| Name | Where set | Used by |
|---|---|---|
| `STRIPE_SECRET_KEY` | Firebase Secret Manager | functions / checkout |
| `STRIPE_WEBHOOK_SECRET` | Firebase Secret Manager | functions / webhook |
| `OPENAI_API_KEY` | Firebase Secret Manager | functions / AI |
| `RESEND_API_KEY` | Firebase Secret Manager | functions / email |
| `SUPER_ADMIN_EMAIL` | functions params | functions / rbac |
| `NEXT_PUBLIC_*` | Vercel env | web (client-safe only) |
| `GCP_SA_KEY` | GitHub Actions secret | backup-verify workflow |
| `BACKUP_BUCKET` | GitHub Actions secret + functions env | backup workflow + function |

## Rotation cadence

- Stripe keys: every 6 months or on suspected leak.
- OpenAI / Resend: every 12 months.
- GCP SA key: every 90 days.
- Super admin password: every 6 months.
