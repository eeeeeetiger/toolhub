import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-collage',
  name: 'Collage & Before-After Maker',
  description:
    'Create photo collages and before/after comparison images in your browser. 2/3/4/9 grid layouts, split view, spacing, rounded corners, background color and aspect presets.',
  longDescription:
    'Collage & Before-After Maker builds shareable photo layouts entirely in your browser. Choose a grid of 2, 3, 4 or 9 cells, or a before/after split with a draggable divider — perfect for fitness, renovation, makeup, photo edits and product comparisons. Fine-tune spacing, corner radius, background color and the overall aspect ratio (square, portrait, landscape and popular social sizes). Drag photos into cells, reposition them, and export a single high-resolution image. Everything runs locally — no uploads.',
  category: 'image',
  keywords: [
    'photo collage maker',
    'before after photo maker',
    'image collage',
    'comparison image',
    'grid collage',
    'photo grid',
    'before and after',
    'side by side photo',
  ],
  icon: 'LayoutGrid',
  isClientOnly: true,
  features: ['2/3/4/9 grids', 'Before/After split', 'Spacing & radius', 'Background color', 'Aspect presets', '100% private'],
  relatedTools: ['image-resize-crop', 'image-watermark', 'image-compressor'],

  howTo: [
    'Open Collage & Before-After Maker in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Collage & Before-After Maker free?', a: 'Yes, Collage & Before-After Maker is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. Collage & Before-After Maker works in any modern browser, no installation needed.' },
  ],
};