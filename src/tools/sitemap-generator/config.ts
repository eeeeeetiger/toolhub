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

  howTo: [
    'Open Sitemap Generator in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is Sitemap Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};