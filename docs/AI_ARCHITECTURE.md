# AI Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Firestore                                                   │
│  /orders   /supportTickets   /aiAlerts   /aiReports          │
│                                            ▲     ▲           │
│                                            │     │           │
│  triggers                              writes  writes        │
│  ──────                                    │     │           │
│  onCreate(supportTickets)  ──►  aiClassifySupportTicket      │
│                                            │                 │
│  scheduler (every 6h)      ──►  aiMonitorOrders              │
│  scheduler (daily 09:00)   ──►  aiDailyReport                │
│                                            │                 │
│  callable (admin)          ──►  aiDraftReply  /  aiApprove   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                       OpenAI Chat Completions
                       (gpt-4o-mini by default)
                              │
                              ▼
                       writes to /aiLogs (every call)
```

## Cost guardrails

- Order monitor pre-filters candidates before calling the model.
- Token counts logged per call for budget tracking.
- Model is env-configurable via `OPENAI_MODEL` (default `gpt-4o-mini`).

## Key files

- `functions/src/lib/ai.ts` — OpenAI client wrapper.
- `functions/src/lib/aiSafety.ts` — hard-coded blocked actions + escalation detector.
- `functions/src/lib/aiPrompts.ts` — system prompts.
- `functions/src/lib/aiLogger.ts` — `/aiLogs` writer.
