import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'schema-generator',
  name: 'Schema Markup Generator',
  description:
    'Generate valid JSON-LD structured data (Article, FAQ, Product, Organization and more) for rich results in Google.',
  longDescription:
    'Schema Markup Generator builds clean, valid JSON-LD structured data you can paste straight into your page <head>. Choose a schema type — Article, FAQ Page, Product, Organization, Breadcrumb or Local Business — fill in a simple form, and get a ready-to-use <script type="application/ld+json"> snippet that helps Google understand your content and show rich results. All generation happens locally in your browser.',
  category: 'seo',
  keywords: ['schema generator', 'json-ld generator', 'structured data generator', 'faq schema', 'product schema', 'rich results markup'],
  icon: 'Code',
  isClientOnly: true,
  features: ['6 schema types', 'Valid JSON-LD output', 'Dynamic form fields', 'One-click copy'],
  relatedTools: ['meta-tag-generator', 'serp-preview'],
};
