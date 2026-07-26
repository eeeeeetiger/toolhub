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
};
