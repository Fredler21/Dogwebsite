# V6 — AI Operations Assistant — Definition of Done

- [x] OpenAI wrapper with model env var + parseJson helper
- [x] AI safety module: 7 blocked actions + escalation keyword detector
- [x] AI logger writes every call to `/aiLogs`
- [x] System prompts pinned in code (not editable from UI)
- [x] `aiClassifySupportTicket` Firestore trigger — category, priority, summary, suggested reply, escalation flag
- [x] `aiMonitorOrders` scheduled (every 6h) — writes to `/aiAlerts`
- [x] `aiDailyReport` scheduled (daily 09:00) — writes to `/aiReports`
- [x] `aiDraftReply` admin callable — regenerate suggested reply
- [x] `aiApproveAction` admin callable — refuses blocked actions
- [x] Admin UI: AI home, alerts, orders, support, reports, automation level, logs
- [x] Docs: AI_SAFETY_RULES, AI_AUTOMATION_LEVELS, AI_ARCHITECTURE
- [ ] Live wiring of admin pages to Firestore (placeholders only — wired in V8 analytics)
- [ ] Budget alerts on token spend (V8)
