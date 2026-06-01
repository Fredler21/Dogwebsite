'use client';
import Script from 'next/script';

/**
 * GA4. Set NEXT_PUBLIC_GA_ID to your measurement ID (e.g. G-XXXXXXX).
 * Loads after interactive to avoid blocking. Respects do-not-track when window.doNotTrack==='1'.
 */
export function GA4() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        if (navigator.doNotTrack !== '1') {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        }
      `}</Script>
    </>
  );
}
