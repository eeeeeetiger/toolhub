import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'robots-txt-generator',
  name: 'Robots.txt Generator',
  description:
    'Create a robots.txt file to control crawler access and point to your sitemap.',
  longDescription:
    'Robots.txt Generator helps you build a valid robots.txt without hand-writing directives. Allow or disallow common bots, block specific paths, and reference your XML sitemap so search engines can discover all your pages. Copy the result and upload it to your site root.',
  category: 'seo',
  keywords: ['robots.txt generator', 'robots txt', 'create robots.txt', 'block crawlers', 'seo robots'],
  icon: 'Search',
  isClientOnly: true,
  features: ['Allow / disallow bots', 'Path rules', 'Sitemap reference', 'Copy & download'],
  relatedTools: ['sitemap-generator', 'meta-tag-generator'],
};
