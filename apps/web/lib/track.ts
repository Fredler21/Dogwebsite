/**
 * Track ecommerce events across all installed pixels.
 * Safe to call from server components — it bails out if window is undefined.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  if ((navigator as { doNotTrack?: string }).doNotTrack === '1') return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
    ttq?: { track: (e: string, p: unknown) => void };
    pintrk?: (...a: unknown[]) => void;
  };
  w.gtag?.('event', name, params);
  const FB_MAP: Record<string, string> = { purchase: 'Purchase', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', view_item: 'ViewContent' };
  w.fbq?.('track', FB_MAP[name] ?? name, params);
  const TT_MAP: Record<string, string> = { purchase: 'CompletePayment', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', view_item: 'ViewContent' };
  w.ttq?.track(TT_MAP[name] ?? name, params);
  const PIN_MAP: Record<string, string> = { purchase: 'checkout', add_to_cart: 'addtocart', view_item: 'viewcategory' };
  w.pintrk?.('track', PIN_MAP[name] ?? name, params);
}
