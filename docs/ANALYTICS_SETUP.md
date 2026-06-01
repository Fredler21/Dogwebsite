# Analytics Setup

Set the following in `apps/web/.env.local` (Vercel: env vars):

```
NEXT_PUBLIC_SITE_URL=https://allyoucanuse.com
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_PINTEREST_TAG_ID=2613000000000
```

Mount in `app/layout.tsx`:

```tsx
import { GA4 } from '@/components/analytics/GA4';
import { MetaPixel, TikTokPixel, PinterestTag } from '@/components/analytics/Pixels';

<body>
  {children}
  <GA4 />
  <MetaPixel />
  <TikTokPixel />
  <PinterestTag />
</body>
```

## Event tracking

Use `trackEvent(name, params)` from `lib/track.ts`. Common events:

```ts
trackEvent('view_item', { item_id, value, currency: 'USD' });
trackEvent('add_to_cart', { item_id, quantity, value, currency: 'USD' });
trackEvent('begin_checkout', { value, currency: 'USD' });
trackEvent('purchase', { transaction_id, value, currency: 'USD' });
```

The helper maps a single GA4-style name across Meta (`Purchase` / `AddToCart`), TikTok (`CompletePayment` / `AddToCart`), and Pinterest (`checkout` / `addtocart`).

## Privacy

All pixels respect `navigator.doNotTrack === '1'` and GA4 has `anonymize_ip`. Consent banner work is in V9.
