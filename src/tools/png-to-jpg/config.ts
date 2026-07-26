import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'png-to-jpg',
  name: 'PNG to JPG',
  description: 'Convert PNG images to JPG to reduce file size.',
  longDescription: 'Switch PNG to JPG for smaller photos. PNG to JPG runs in your browser — no upload, no server.',
  category: 'image',
  keywords: ['png to jpg', 'convert png to jpg', 'png to jpg converter', 'png jpg'],
  icon: 'Image',
  isClientOnly: true,
  features: ['PNG → JPG', 'Smaller size', 'Local only'],
  relatedTools: ['image-converter', 'jpg-to-png'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',
};
