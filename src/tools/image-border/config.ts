import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-border',
  name: 'Image Border & Rounded Corners',
  description:
    'Add rounded corners and a colored or gradient border to any image — instantly.',
  longDescription:
    'Give your images a polished frame in one click. Upload a photo, choose a corner radius, set the border width, pick a solid color or gradient border, and download the result. Perfect for profile pictures, product shots and social thumbnails. Everything is processed locally in your browser.',
  category: 'image',
  keywords: ['image border', 'rounded corners', 'add border to photo', 'circle image', 'image frame maker'],
  icon: 'Square',
  isClientOnly: true,
  features: ['Rounded corners', 'Solid / gradient border', 'Border width & bg', 'Instant download'],
  relatedTools: ['image-compressor', 'image-resize-crop'],

  howTo: [
    'Open Image Border & Rounded Corners in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image Border & Rounded Corners free?', a: 'Yes, Image Border & Rounded Corners is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image Border & Rounded Corners works in any modern browser, no installation needed.' },
  ],
};