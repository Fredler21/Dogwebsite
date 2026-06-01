/**
 * Lightweight client A/B testing. Bucket by stable user/session ID.
 * Persist the assignment so the user has a consistent experience.
 */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}

export function getBucketId(): string {
  if (typeof window === 'undefined') return 'server';
  const KEY = 'ayc-bucket-id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

export interface ExperimentSpec<V extends string> {
  key: string;
  variants: V[];
  weights?: number[];
}

export function assignVariant<V extends string>(spec: ExperimentSpec<V>): V {
  const bucket = getBucketId();
  const h = hash(`${spec.key}:${bucket}`) / 0xffffffff;
  const weights = spec.weights ?? spec.variants.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < spec.variants.length; i++) {
    acc += weights[i] / total;
    if (h < acc) return spec.variants[i];
  }
  return spec.variants[spec.variants.length - 1];
}
