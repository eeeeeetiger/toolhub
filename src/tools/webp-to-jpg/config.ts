import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'webp-to-jpg',
  name: 'WEBP to JPG',
  description: 'Convert WEBP images to JPG for maximum compatibility.',
  longDescription: 'Open WEBP files anywhere by converting to JPG. WEBP to JPG runs on your device.',
  category: 'image',
  keywords: ['webp to jpg', 'convert webp to jpg', 'webp to jpg converter', 'webp jpg'],
  icon: 'Image',
  isClientOnly: true,
  features: ['WEBP → JPG', 'Compatible', 'Local only'],
  relatedTools: ['image-converter', 'webp-to-png'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',
};
