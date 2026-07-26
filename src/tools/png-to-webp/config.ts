import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'png-to-webp',
  name: 'PNG to WEBP',
  description: 'Convert PNG to WEBP for smaller web images.',
  longDescription: 'Shrink PNG files for the web with WEBP. PNG to WEBP runs in your browser.',
  category: 'image',
  keywords: ['png to webp', 'convert png to webp', 'png to webp converter', 'png webp'],
  icon: 'Image',
  isClientOnly: true,
  features: ['PNG → WEBP', 'Smaller web size', 'Local only'],
  relatedTools: ['image-converter', 'jpg-to-webp'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',
};
