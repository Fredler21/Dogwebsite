import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/lib/cart';
import { ThemeProvider } from '@/lib/theme';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ConsentBanner } from '@/components/ConsentBanner';
import { GA4 } from '@/components/analytics/GA4';
import { MetaPixel, TikTokPixel, PinterestTag } from '@/components/analytics/Pixels';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://refinedpaw.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Refined Paw: gear for happy, healthy dogs', template: '%s | Refined Paw' },
  description: 'Well-made dog accessories shipped to your door. Free returns. Real support.',
  openGraph: { type: 'website', siteName: 'Refined Paw', url: SITE_URL }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <ErrorBoundary>
          <ThemeProvider preset="pet">
            <CartProvider>
              <Header />
              <main className="min-h-[60vh]">{children}</main>
              <Footer />
              <ConsentBanner />
            </CartProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <GA4 />
        <MetaPixel />
        <TikTokPixel />
        <PinterestTag />
      </body>
    </html>
  );
}
