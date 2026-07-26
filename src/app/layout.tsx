import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'ToolHub — Free Online Tools for Developers & Marketers',
    template: '%s | ToolHub',
  },
  description:
    'Free, fast and private online tools for developers, marketers and creators. Text, developer, SEO, image and PDF utilities that run entirely in your browser.',
  keywords:
    'online tools, free tools, json formatter, base64, meta tag generator, image compressor, pdf merge, word counter',
  openGraph: {
    title: 'ToolHub — Free Online Tools',
    description:
      'Free, fast and private online tools. Everything runs in your browser.',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://toolhub.dev'),
  alternates: {
    canonical: 'https://toolhub.dev',
  },
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
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
