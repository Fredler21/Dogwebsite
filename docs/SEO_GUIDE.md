# SEO Guide

## Technical

- Next.js App Router with `app/sitemap.ts` and `app/robots.ts` (this branch adds robots; V1 added sitemap).
- Product JSON-LD via `lib/seo.ts → productJsonLd(...)`. Drop into PDP server component.
- All image components use `next/image` for proper dimensions + lazy loading.
- Set canonical URL via `export const metadata = { alternates: { canonical: ... } }` on each route.

## Content

- Each product page: title + 60-160 char meta description + at least 1 H1 + product JSON-LD.
- Each category page: short intro paragraph above grid (helps SEO + reduces bounce).
- Blog (post-V10): "best car phone mount 2026", "how to organize your car backseat", etc.

## Off-page

- Submit sitemap to Google Search Console + Bing Webmaster Tools.
- Build backlinks via product reviews, affiliate posts, automotive forums.

## Page speed

- Lighthouse target: ≥ 90 on mobile.
- Defer all pixel scripts to `afterInteractive` (we do).
- Use `next/font` for self-hosted fonts; avoid third-party font CDNs.
