# Support Workflow

## Ticket lifecycle

```
open → pending_admin → waiting_customer → solved → closed
                    ↘ escalated (V6 AI flag)
```

## Response targets

| Priority | First response |
|---|---|
| urgent | < 2 hours (business) |
| high | < 8 hours |
| medium | < 24 hours |
| low | < 48 hours |

## Categories

`tracking | refund | return | damaged | wrong_item | payment | general`

## Tone rules (from PRD section 16)

- Simple English.
- Professional.
- No fake promises.
- Give a clear next step.
- Include order number when known.

## What AI does (V6)

- Classifies category + priority on create.
- Drafts a suggested reply (admin must approve before send).
- Escalates angry/legal/chargeback/high-value tickets.
- Never replies autonomously about refunds, cancellations, or price changes.
