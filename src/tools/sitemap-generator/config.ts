import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'sitemap-generator',
  name: 'Sitemap Generator',
  description:
    'Turn a list of URLs into a standards-compliant XML sitemap for search engines.',
  longDescription:
    'Sitemap Generator converts a plain list of URLs into a valid XML sitemap you can submit to Google Search Console and Bing Webmaster Tools. Paste one URL per line, optionally set a change frequency and priority, and download the sitemap.xml to speed up indexing.',
  category: 'seo',
  keywords: ['sitemap generator', 'xml sitemap', 'create sitemap', 'sitemap.xml', 'seo sitemap'],
  icon: 'Search',
  isClientOnly: true,
  features: ['XML output', 'One URL per line', 'Download .xml', 'SEO ready'],
  relatedTools: ['robots-txt-generator', 'meta-tag-generator'],
};
