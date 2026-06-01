# Email Setup

We use **Resend** for transactional email. Any provider with a Node SDK (SendGrid, Postmark, Mailgun) works with a small swap in `functions/src/lib/email.ts`.

## Steps

1. Create a Resend account → API keys → create a new key (server-side scope).
2. Verify your sending domain (`allyoucanuse.com`):
   - Add SPF, DKIM, and DMARC records to DNS as shown in the Resend dashboard.
3. Set Firebase secret:
   ```bash
   firebase functions:secrets:set RESEND_API_KEY
   ```
4. Configure `FROM_EMAIL` and `SUPPORT_EMAIL` env vars on functions:
   ```bash
   firebase functions:config:set email.from="Allyoucanuse <support@allyoucanuse.com>"
   ```
5. Deploy: `firebase deploy --only functions`.

## Local testing

Use Resend's test API key or stub `sendEmail` to log to console during emulator runs.

## Logs

Every send writes to `/emailLogs` with the recipient, subject, template name, and related ref (e.g. order or ticket ID) for audit + debugging.
