import Script from 'next/script';
import { ADSENSE_CLIENT_ID } from '@/lib/site';

const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK ?? 'none';
const CF_ANALYTICS_TOKEN =
  process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim() ?? '';

export function SiteScripts() {
  return (
    <>
      {AD_NETWORK === 'adsense' && ADSENSE_CLIENT_ID && (
        <Script
          id="adsense-script"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
        />
      )}

      {CF_ANALYTICS_TOKEN && (
        <Script
          id="cloudflare-web-analytics"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: CF_ANALYTICS_TOKEN })}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
