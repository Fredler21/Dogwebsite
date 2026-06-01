# V2 — Firebase Backend MVP

Firestore schema, security rules, and Cloud Function skeletons. No real integrations yet — those land in:
- V4 Stripe wiring
- V5 email + support ticket UX
- V6 AI assistant
- V7 supplier workflow
- V9 strict rules + audit logs

Deploy:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```
