# Scheduled Jobs (V8)

All run via Firebase Cloud Scheduler.

| Function | Cadence | Purpose |
|---|---|---|
| `checkAbandonedCarts` | every 6h | Queue abandoned-cart emails (24-72h since update) |
| `checkDelayedOrders` | every 12h | Create AI alerts for paid+unshipped orders ≥ 5 days |
| `sendReviewRequests` | daily 10:00 ET | Queue review requests for orders delivered 7-9d ago |
| `lowStockAlerts` | every 6h | Alert when `inventoryCount <= lowStockThreshold` |
| `nudgeStuckSupplierOrders` | daily 11:00 ET | Email supplier when status stuck ≥ 3d |
| `aiMonitorOrders` (V6) | every 6h | LLM scan of risky orders |
| `aiDailyReport` (V6) | daily 09:00 ET | LLM admin briefing |
| `computeSupplierScorecards` (V10) | nightly | Roll up on-time/defect rates |

## Operational notes

- Each function uses `.limit()` to cap per-run work and avoid timeouts.
- Idempotency flags on documents (`abandonedEmailSent`, `reviewRequestSent`, `nudgedAt`) prevent duplicates.
- Failures are captured by Cloud Functions logs and surface as AI alerts via V6 monitor.
