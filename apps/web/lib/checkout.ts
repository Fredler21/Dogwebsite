/**
 * Client-side helper that calls the `createCheckoutSession` Firebase callable
 * and redirects to the Stripe-hosted checkout URL.
 */
export async function startCheckout(input: {
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  customerEmail?: string;
  discountCode?: string;
}): Promise<void> {
  const { getFunctions, httpsCallable } = await import('firebase/functions');
  const { getApps, initializeApp } = await import('firebase/app');
  const app = getApps()[0] ?? initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  });
  const res = await httpsCallable<unknown, { url: string }>(
    getFunctions(app), 'createCheckoutSession'
  )(input);
  if (!res.data?.url) throw new Error('No checkout URL returned');
  window.location.href = res.data.url;
}
