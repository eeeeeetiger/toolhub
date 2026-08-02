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

  faqs: [
    { q: 'Is JPG to WEBP free?', a: 'Yes, JPG to WEBP is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. JPG to WEBP works in any modern browser, no installation needed.' },
  ],
};