import type { Metadata } from 'next';
import type { ToolConfig } from '@/tools/types';
import { SITE_NAME, siteUrl } from '@/lib/site';

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const title = `${tool.name} — Free Online Tool`;
  const url = siteUrl(`/tools/${tool.slug}`);
  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tool.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

export function toolJsonLd(tool: ToolConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: siteUrl(`/tools/${tool.slug}`),
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
