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

  howTo: [
    'Open Robots.txt Generator in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is Robots.txt Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};