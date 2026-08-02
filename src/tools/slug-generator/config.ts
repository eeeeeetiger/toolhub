import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'slug-generator',
  name: 'Slug Generator',
  description:
    'Turn any title or heading into a clean, SEO-friendly URL slug. Supports multiple separators and lowercase output.',
  longDescription:
    'Slug Generator turns blog titles, product names and headings into URL-safe slugs. Choose between hyphen, underscore or dot separators, strip stop words, and copy the result for use in CMS permalinks, file names or navigation. Perfect for SEO and clean, readable URLs.',
  category: 'seo',
  keywords: ['slug generator', 'url slug', 'seo slug', 'permalink generator', 'slugify online'],
  icon: 'Type',
  isClientOnly: true,
  features: ['SEO-friendly slugs', 'Separator options', 'Lowercase output', 'One-click copy'],
  relatedTools: ['word-counter', 'case-converter'],

  howTo: [
    'Open Slug Generator in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is Slug Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};