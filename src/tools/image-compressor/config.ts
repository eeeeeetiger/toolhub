import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-compressor',
  name: 'Image Compressor',
  description:
    'Batch-compress images in your browser. Original/JPG/WebP output, high-ratio PNG via color quantization or lossless oxipng, live size estimate, folder upload and ZIP download.',
  longDescription:
    'Image Compressor shrinks image file size entirely in your browser, running every step in a background Web Worker so the UI never freezes. Compress many images at once, upload a whole folder, and download everything as a single ZIP. Pick the output format (keep original, JPG, or WebP), tune a quality slider, and see a live size estimate that updates as you drag. PNG gets two modes: high-compression color quantization for the smallest files, or true lossless optimization via the oxipng WebAssembly encoder. Everything runs locally — no upload, no server, fully private.',
  category: 'image',
  keywords: ['image compressor', 'compress jpg', 'compress png', 'compress webp', 'reduce image size', 'batch image optimizer', 'pngquant', 'oxipng', 'optimize images online'],
  icon: 'Image',
  isClientOnly: true,
  features: ['Original/JPG/WebP', 'PNG: quant + oxipng', 'Live estimate', 'Batch & folder', 'ZIP download', 'Web Worker', '100% private'],
  relatedTools: ['image-converter'],

  howTo: [
    'Open Image Compressor in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Image Compressor free?', a: 'Yes, Image Compressor is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Image Compressor works in any modern browser, no installation needed.' },
  ],
};