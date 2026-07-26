import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'favicon-generator',
  name: 'Favicon Generator',
  description:
    'Generate multi-size favicons (16/32/180/192/512) from an image or text and download them as a ZIP.',
  longDescription:
    'Create a complete favicon set for your website in seconds. Upload an image or type a letter, emoji or your brand initials, choose a background color, and we render every common size — 16×16, 32×32, 48×48, 180×180 (Apple touch), 192×192 and 512×512 (Android/PWA). Everything is packaged into a single ZIP with ready-to-paste HTML link tags. Fully client-side.',
  category: 'utility',
  keywords: ['favicon generator', 'favicon maker', 'generate favicon online', 'website icon generator', 'pwa icon'],
  icon: 'Image',
  isClientOnly: true,
  features: ['Image or text input', '6 common sizes', 'ZIP download', 'HTML link code'],
  relatedTools: ['color-picker', 'image-compressor'],
};
