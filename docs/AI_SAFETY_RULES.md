# AI Safety Rules (verbatim from PRD section 13.3)

These rules are enforced in code at `functions/src/lib/aiSafety.ts` and CANNOT be overridden by changing the automation level.

## The AI must NEVER autonomously

1. Issue refunds
2. Cancel orders
3. Change product prices
4. Change product data (title, description, images)
5. Send customer emails about money matters
6. Modify supplier payouts
7. Change legal text (terms, privacy, refund policy)

## The AI must escalate to a human when

- Customer message contains: `lawyer`, `lawsuit`, `attorney`, `sue`, `court`, `chargeback`, `fraud`, `BBB`, `consumer protection`, `media`
- Tone signals anger: ALL-CAPS streaks, `!!!` runs, words like `furious`, `unacceptable`, `scam`
- Order value ≥ $200
- Customer has contacted support ≥ 3 times
- AI confidence is low (`needsHumanReview: true` in classification output)

## Logging

Every AI call writes to `/aiLogs` with: task, model, prompt token count, completion token count, output, flagged flag, escalation reason, and related record ref. No exceptions.
