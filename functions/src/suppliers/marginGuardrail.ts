import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { db } from '../lib/admin';

/**
 * Margin guardrail + supplier price-review watcher.
 *
 * Two safety nets that prevent Refined Paw from listing money-losing products
 * after a supplier raises their cost:
 *
 *  1. `validateProductMargin` — callable used by the admin product editor
 *     before publishing. Refuses publish when retail < cost * MIN_MARGIN_MULT.
 *
 *  2. `recordSupplierCostChange` — call this whenever a supplier price update
 *     comes in (manually pasted, API poll, CSV import). If the change exceeds
 *     `PRICE_REVIEW_PCT`, the product is flagged with `pendingPriceReview=true`
 *     and its status is forced to `draft` so it can't sell at the old price.
 *
 * Thresholds live in /config/pricing (admin-editable) and fall back to the
 * defaults below.
 */

const DEFAULT_MIN_MARGIN_MULT = 1.8;   // retail must be >= cost * 1.8
const DEFAULT_PRICE_REVIEW_PCT = 10;   // cost change > 10% triggers review

interface PricingConfig {
  minMarginMult: number;
  priceReviewPct: number;
}

async function loadPricingConfig(): Promise<PricingConfig> {
  const snap = await db.collection('config').doc('pricing').get();
  const data = snap.exists ? snap.data() ?? {} : {};
  const minMarginMult = typeof data.minMarginMult === 'number' && data.minMarginMult >= 1
    ? data.minMarginMult : DEFAULT_MIN_MARGIN_MULT;
  const priceReviewPct = typeof data.priceReviewPct === 'number' && data.priceReviewPct >= 0
    ? data.priceReviewPct : DEFAULT_PRICE_REVIEW_PCT;
  return { minMarginMult, priceReviewPct };
}

function requireAdmin(req: CallableRequest): void {
  if (req.auth?.token?.admin !== true) throw new HttpsError('permission-denied', 'Admin only');
}

interface MarginCheckInput {
  priceCents?: number;
  costCents?: number;
}

interface MarginCheckResult {
  ok: boolean;
  marginMult: number;
  minMarginMult: number;
  reason?: string;
}

/**
 * Pure helper — exported so the AI safety layer + scheduled jobs can reuse it.
 */
export function checkMargin(
  priceCents: number,
  costCents: number,
  minMarginMult: number
): MarginCheckResult {
  if (!Number.isFinite(priceCents) || priceCents <= 0) {
    return { ok: false, marginMult: 0, minMarginMult, reason: 'invalid price' };
  }
  if (!Number.isFinite(costCents) || costCents <= 0) {
    return { ok: false, marginMult: 0, minMarginMult, reason: 'cost not set' };
  }
  const mult = priceCents / costCents;
  if (mult < minMarginMult) {
    return {
      ok: false,
      marginMult: mult,
      minMarginMult,
      reason: `price ${priceCents}c is only ${mult.toFixed(2)}x cost ${costCents}c (min ${minMarginMult}x)`
    };
  }
  return { ok: true, marginMult: mult, minMarginMult };
}

export const validateProductMargin = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { priceCents, costCents } = (req.data ?? {}) as MarginCheckInput;
  if (typeof priceCents !== 'number' || typeof costCents !== 'number') {
    throw new HttpsError('invalid-argument', 'priceCents + costCents (numbers) required');
  }
  const cfg = await loadPricingConfig();
  return checkMargin(priceCents, costCents, cfg.minMarginMult);
});

interface CostChangeInput {
  productId?: string;
  variantId?: string | null;
  newCostCents?: number;
  supplierId?: string;
  source?: 'manual' | 'api' | 'csv';
}

/**
 * Records a supplier cost change against /products/{id} (or a variant).
 * If the % change exceeds the configured threshold, the product is flagged
 * `pendingPriceReview=true` and forced back to `draft` until an admin re-prices.
 *
 * Returns the previous cost, new cost, percent change, and whether a review
 * was triggered.
 */
export const recordSupplierCostChange = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const input = (req.data ?? {}) as CostChangeInput;
  if (!input.productId) throw new HttpsError('invalid-argument', 'productId required');
  if (typeof input.newCostCents !== 'number' || input.newCostCents <= 0)
    throw new HttpsError('invalid-argument', 'newCostCents must be positive number');

  const cfg = await loadPricingConfig();
  const ref = db.collection('products').doc(input.productId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'product not found');
  const product = snap.data() ?? {};

  let previousCostCents = 0;
  const updates: Record<string, unknown> = {
    lastCostChangeAt: Date.now(),
    updatedAt: Date.now()
  };

  if (input.variantId) {
    const variants: Array<Record<string, unknown>> = Array.isArray(product.variants) ? product.variants : [];
    const idx = variants.findIndex(v => v && v.id === input.variantId);
    if (idx === -1) throw new HttpsError('not-found', 'variant not found');
    previousCostCents = typeof variants[idx].costCents === 'number' ? variants[idx].costCents as number : 0;
    variants[idx] = { ...variants[idx], costCents: input.newCostCents };
    updates.variants = variants;
  } else {
    previousCostCents = typeof product.costCents === 'number' ? product.costCents : 0;
    updates.costCents = input.newCostCents;
  }

  const pctChange = previousCostCents > 0
    ? Math.abs((input.newCostCents - previousCostCents) / previousCostCents) * 100
    : 0;
  const reviewTriggered = previousCostCents > 0 && pctChange >= cfg.priceReviewPct;

  if (reviewTriggered) {
    updates.pendingPriceReview = true;
    updates.priceReviewReason =
      `Supplier cost changed ${pctChange.toFixed(1)}% (${previousCostCents}c → ${input.newCostCents}c)`;
    if (product.status === 'active') updates.status = 'draft';
  }

  await ref.update(updates);
  await db.collection('supplierCostHistory').add({
    productId: input.productId,
    variantId: input.variantId ?? null,
    supplierId: input.supplierId ?? product.supplierId ?? null,
    previousCostCents,
    newCostCents: input.newCostCents,
    pctChange,
    reviewTriggered,
    source: input.source ?? 'manual',
    recordedBy: req.auth?.uid ?? null,
    createdAt: Date.now()
  });

  return {
    ok: true,
    previousCostCents,
    newCostCents: input.newCostCents,
    pctChange,
    reviewTriggered,
    threshold: cfg.priceReviewPct
  };
});

/**
 * Clears the pendingPriceReview flag after an admin has re-priced a product.
 * Optionally re-publishes (sets status='active') if the new margin is healthy.
 */
interface ApprovePriceReviewInput {
  productId?: string;
  republish?: boolean;
}

export const approvePriceReview = onCall(async (req: CallableRequest) => {
  requireAdmin(req);
  const { productId, republish } = (req.data ?? {}) as ApprovePriceReviewInput;
  if (!productId) throw new HttpsError('invalid-argument', 'productId required');

  const ref = db.collection('products').doc(productId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'product not found');
  const product = snap.data() ?? {};

  if (republish) {
    const cfg = await loadPricingConfig();
    const result = checkMargin(
      typeof product.price === 'number' ? product.price : 0,
      typeof product.costCents === 'number' ? product.costCents : 0,
      cfg.minMarginMult
    );
    if (!result.ok) {
      throw new HttpsError('failed-precondition', `Cannot republish: ${result.reason}`);
    }
  }

  await ref.update({
    pendingPriceReview: false,
    priceReviewReason: null,
    ...(republish ? { status: 'active' } : {}),
    updatedAt: Date.now()
  });
  return { ok: true };
});
