import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'webp-to-png',
  name: 'WEBP to PNG',
  description: 'Convert WEBP images to PNG without quality loss.',
  longDescription: 'Change WEBP to PNG when you need lossless output. WEBP to PNG processes locally in your browser.',
  category: 'image',
  keywords: ['webp to png', 'convert webp to png', 'webp to png converter', 'webp png'],
  icon: 'Image',
  isClientOnly: true,
  features: ['WEBP → PNG', 'Lossless', 'Local only'],
  relatedTools: ['image-converter', 'webp-to-jpg'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',
};
