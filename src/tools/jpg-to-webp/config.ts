import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jpg-to-webp',
  name: 'JPG to WEBP',
  description: 'Convert JPG to WEBP to speed up your website.',
  longDescription: 'Make JPG photos lighter with WEBP. JPG to WEBP processes locally in your browser.',
  category: 'image',
  keywords: ['jpg to webp', 'convert jpg to webp', 'jpg to webp converter', 'jpg webp'],
  icon: 'Image',
  isClientOnly: true,
  features: ['JPG → WEBP', 'Web optimized', 'Local only'],
  relatedTools: ['image-converter', 'png-to-webp'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',
};
