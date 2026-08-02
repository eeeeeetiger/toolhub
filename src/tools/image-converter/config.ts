import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-converter',
  name: 'Image Converter',
  description:
    'Convert images between JPG, PNG and WebP formats right in your browser. Fast and private.',
  longDescription:
    'Image Converter changes image formats without uploading anything. Load a JPG, PNG or WebP file, pick the target format, and download the converted result instantly using the Canvas API. Useful for switching to modern WebP for smaller pages or preparing assets for different platforms.',
  category: 'image',
  keywords: ['image converter', 'convert png to jpg', 'convert to webp', 'jpg to png', 'image format converter'],
  icon: 'Image',
  isClientOnly: true,
  features: ['JPG / PNG / WebP', 'Batch & folder upload', 'ZIP download', 'Private'],
  relatedTools: ['image-compressor'],

  howTo: [
    'Open Image Converter in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image Converter free?', a: 'Yes, Image Converter is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image Converter works in any modern browser, no installation needed.' },
  ],
};