# Scaling Notes

## Firestore

- Composite indexes defined in `firestore.indexes.json` (V2). Add new ones via Firebase console error links.
- Use `.count()` aggregations for dashboards instead of pulling docs.
- Avoid hot keys: never write to a single doc from > 1 req/sec sustained.
- Backups: nightly export via V9 `nightlyBackup` to GCS.

## Cloud Functions

- Concurrency: set `cpu: 1, memory: '256MiB'` on cheap functions; bump to `'1GiB'` only for AI ones.
- Cold starts: keep dependency tree lean. Each phase has its own `functions/package.json` to highlight what's actually used.
- Region: pin to `us-east1` (same as Firestore) to avoid egress.

## Web

- Next.js ISR for product pages (`revalidate: 300`) — invalidated by `/products` writes via on-demand revalidation API (TODO).
- Image CDN: Firebase Storage → Imgix or Cloud CDN.
- Bundle budget: < 200KB JS per route. Audit with `next build`.

## Cost ceilings (alerts)

| Service | Soft cap | Hard cap |
|---|---|---|
| Firestore reads | 5M / day | 20M / day |
| Functions invocations | 1M / day | 5M / day |
| OpenAI | $20 / day | $100 / day |
| Storage egress | 10 GB / day | 100 GB / day |

Wire these to GCP billing alerts.
