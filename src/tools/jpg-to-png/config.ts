import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jpg-to-png',
  name: 'JPG to PNG',
  description: 'Convert JPG images to PNG to keep transparency and quality.',
  longDescription: 'Turn JPG into PNG when you need lossless quality. JPG to PNG processes locally in your browser.',
  category: 'image',
  keywords: ['jpg to png', 'convert jpg to png', 'jpg to png converter', 'jpg png'],
  icon: 'Image',
  isClientOnly: true,
  features: ['JPG → PNG', 'Lossless', 'Local only'],
  relatedTools: ['image-converter', 'png-to-jpg'],
  howTo: ['Add your image file.', 'We convert it locally in your browser.', 'Download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is JPG to PNG free?', a: 'Yes, JPG to PNG is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. JPG to PNG works in any modern browser, no installation needed.' },
  ],
};