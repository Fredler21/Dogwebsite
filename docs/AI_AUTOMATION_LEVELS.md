# AI Automation Levels

| Level | AI may auto-execute | Always blocked |
|---|---|---|
| **manual** | nothing | (n/a — AI off) |
| **suggest** (default) | nothing — drafts + alerts only | all 7 blocked actions |
| **assist** | tracking-status replies, review-request emails | refunds, cancels, price changes, product edits, money emails, supplier payouts, legal text |
| **autonomous_safe** | clearly-resolved tracking replies | refunds, cancels, price changes, product edits, money emails, supplier payouts, legal text |

Change the level on `/admin/ai/automation`. Setting is stored at `/config/ai.level`. The 7 blocked actions are enforced in `aiSafety.ts` and cannot be unblocked via configuration.
