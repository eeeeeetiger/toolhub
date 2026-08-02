import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'avif-converter',
  name: 'AVIF Converter',
  description: 'Convert images to and from AVIF.',
  longDescription: 'Make modern, tiny AVIF files from PNG/JPG/WebP (when your browser supports it), or convert AVIF back to a widely compatible format. Runs locally.',
  category: 'image',
  keywords: ['avif converter', 'to avif', 'avif to png', 'avif image'],
  icon: 'ImageDown',
  isClientOnly: true,
  features: ['Modern format', 'Local', 'PNG fallback'],
  relatedTools: ['image-converter', 'heic-to-jpg', 'svg-to-png'],

  howTo: [
    'Open AVIF Converter in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is AVIF Converter free?', a: 'Yes, AVIF Converter is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. AVIF Converter works in any modern browser, no installation needed.' },
  ],
};