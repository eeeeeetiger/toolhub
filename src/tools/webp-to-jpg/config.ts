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

  faqs: [
    { q: 'Is WEBP to JPG free?', a: 'Yes, WEBP to JPG is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. WEBP to JPG works in any modern browser, no installation needed.' },
  ],
};