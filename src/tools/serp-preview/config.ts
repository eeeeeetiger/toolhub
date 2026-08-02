import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'serp-preview',
  name: 'Google SERP Preview',
  description:
    'Preview how your page title and meta description will look in Google search results, with pixel-width truncation warnings.',
  longDescription:
    'SERP Preview shows you exactly how your title tag and meta description will appear in Google search results on both desktop and mobile. It measures the real pixel width Google uses to truncate snippets (about 580px for titles and 920px for descriptions) and warns you before your text gets cut off with an ellipsis. Optimize your click-through rate by fine-tuning length and wording before you publish — everything runs in your browser.',
  category: 'seo',
  keywords: ['serp preview', 'google serp simulator', 'meta description preview', 'title tag length checker', 'snippet preview tool'],
  icon: 'Search',
  isClientOnly: true,
  features: ['Desktop & mobile preview', 'Pixel-width truncation', 'Length warnings', 'Live snippet render'],
  relatedTools: ['meta-tag-generator', 'schema-generator'],

  howTo: [
    'Open Google SERP Preview in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is Google SERP Preview free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};