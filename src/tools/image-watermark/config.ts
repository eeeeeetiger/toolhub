import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-watermark',
  name: 'Watermark & Text on Image',
  description:
    'Add text or a logo watermark to your photos in the browser. Opacity, 9-grid positioning, tiled watermarks and batch processing with ZIP export.',
  longDescription:
    'Watermark & Text on Image lets you protect and brand your photos entirely in your browser. Add custom text with your choice of font, size, color, outline and shadow, or upload a logo image as a watermark. Control opacity, rotation and placement with a 9-position grid, or tile the watermark across the whole image. Drop in many photos at once, apply the same watermark to all of them, and download everything as a ZIP. Nothing is uploaded — your images never leave your device.',
  category: 'image',
  keywords: [
    'add watermark to photo',
    'add text to image',
    'watermark maker',
    'logo watermark',
    'batch watermark',
    'photo watermark',
    'text on image',
    'copyright watermark',
  ],
  icon: 'Stamp',
  isClientOnly: true,
  features: ['Text & logo', 'Opacity control', '9-grid position', 'Tiled watermark', 'Batch + ZIP', '100% private'],
  relatedTools: ['image-resize-crop', 'image-compressor', 'image-converter'],

  howTo: [
    'Open Watermark & Text on Image in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Watermark & Text on Image free?', a: 'Yes, Watermark & Text on Image is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Watermark & Text on Image works in any modern browser, no installation needed.' },
  ],
};