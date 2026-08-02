import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-filter',
  name: 'Image Filter & Adjust',
  description: 'Adjust brightness, contrast, grayscale, sepia and more.',
  longDescription: 'Tune your photos with live filters — brightness, contrast, grayscale, sepia, blur and invert — and export the result as a PNG. All in your browser.',
  category: 'image',
  keywords: ['image filter', 'photo filter', 'adjust image', 'grayscale photo'],
  icon: 'Wand2',
  isClientOnly: true,
  features: ['Live preview', 'Multiple filters', 'Local'],
  relatedTools: ['svg-to-png', 'image-converter', 'avif-converter'],

  howTo: [
    'Open Image Filter & Adjust in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image Filter & Adjust free?', a: 'Yes, Image Filter & Adjust is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image Filter & Adjust works in any modern browser, no installation needed.' },
  ],
};