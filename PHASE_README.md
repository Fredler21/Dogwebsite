# V3 — Admin Dashboard

Next.js admin section under `/admin/*`. Protected by Firebase Auth + the `admin` custom claim (see V2 backend). Mock data lives in `lib/mockData.ts`; real Firestore wiring happens after V2 is deployed.

Routes shipped here: overview, orders + detail, products + new, plus placeholders for V5/V6/V7/V8 sections.
