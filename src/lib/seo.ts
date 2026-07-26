import type { Metadata } from 'next';
import type { ToolConfig } from '@/tools/types';

export function generateToolMetadata(tool: ToolConfig): Metadata {
  const title = `${tool.name} — Free Online Tool`;
  const url = `https://toolhub.dev/tools/${tool.slug}`;
  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: tool.description,
      url,
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
    url: `https://toolhub.dev/tools/${tool.slug}`,
  };
}
