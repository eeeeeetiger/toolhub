import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'ocr',
  name: 'Image to Text (OCR)',
  description: 'Extract text from images with OCR.',
  longDescription: 'Read text out of screenshots, scanned docs and photos using in-browser OCR. The recognition model loads on demand; your images stay on your device.',
  category: 'image',
  keywords: ['ocr', 'image to text', 'extract text from image', 'photo to text'],
  icon: 'ScanText',
  isClientOnly: true,
  features: ['Text extraction', 'On-device', 'Copy result'],
  relatedTools: ['svg-to-png', 'image-filter', 'pdf-extract-text'],

  howTo: [
    'Open Image to Text (OCR) in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image to Text (OCR) free?', a: 'Yes, Image to Text (OCR) is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image to Text (OCR) works in any modern browser, no installation needed.' },
  ],
};