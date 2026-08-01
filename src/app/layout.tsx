import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SiteScripts } from '@/components/layout/site-scripts';
import { ADSENSE_CLIENT_ID, SITE_NAME, SITE_URL } from '@/lib/site';
import { Providers } from './providers';

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — Free Online Tools That Run on Your Device`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free, fast and private online tools. Everything runs in your browser — your files never leave your device.',
  keywords:
    'online tools, free tools, json formatter, base64, meta tag generator, image compressor, pdf merge, word counter',
  openGraph: {
    title: `${SITE_NAME} — Free Online Tools`,
    description:
      'Free, fast and private online tools. Everything runs in your browser — your files never leave your device.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} — Free Online Tools`,
    description:
      'Free, fast and private online tools that run in your browser.',
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  ...(ADSENSE_CLIENT_ID
    ? { other: { 'google-adsense-account': ADSENSE_CLIENT_ID } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)] flex-1">{children}</main>
          <Footer />
        </Providers>
        <SiteScripts />
      </body>
    </html>
  );
}
