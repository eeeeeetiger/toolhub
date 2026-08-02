import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'heic-to-jpg',
  name: 'HEIC to JPG',
  description: 'Convert iPhone HEIC / HEIF photos to JPG.',
  longDescription: 'iPhone photos are usually HEIC, which many sites reject. Convert them to JPG locally in your browser so you can upload and share anywhere.',
  category: 'image',
  keywords: ['heic to jpg', 'heif converter', 'iphone photo converter', 'convert heic'],
  icon: 'Smartphone',
  isClientOnly: true,
  features: ['iPhone photos', 'Local & private', 'High quality'],
  relatedTools: ['image-converter', 'avif-converter', 'svg-to-png'],

  howTo: [
    'Open HEIC to JPG in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is HEIC to JPG free?', a: 'Yes, HEIC to JPG is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. HEIC to JPG works in any modern browser, no installation needed.' },
  ],
};