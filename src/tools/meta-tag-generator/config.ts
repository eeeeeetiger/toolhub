import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'meta-tag-generator',
  name: 'Meta Tag Generator',
  description:
    'Generate Open Graph, Twitter Card and canonical meta tags for your page with a live HTML preview.',
  longDescription:
    'Meta Tag Generator builds the exact <meta> snippets you need for social sharing and SEO. Enter your page title, description, URL and image, then copy ready-to-paste Open Graph, Twitter Card and canonical tags. A live preview shows how the card will look when shared.',
  category: 'seo',
  keywords: ['meta tag generator', 'open graph generator', 'og tags', 'twitter card generator', 'canonical tag generator'],
  icon: 'Search',
  isClientOnly: true,
  features: ['Open Graph tags', 'Twitter Card', 'Canonical tag', 'Live preview & copy'],
  relatedTools: ['robots-txt-generator', 'sitemap-generator'],

  howTo: [
    'Open Meta Tag Generator in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is Meta Tag Generator free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};