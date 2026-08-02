import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'svg-to-png',
  name: 'SVG to PNG',
  description: 'Convert SVG vector files to PNG images.',
  longDescription: 'Turn an SVG into a raster PNG right in your browser using the Canvas API. Perfect for sharing vectors where PNG is required.',
  category: 'image',
  keywords: ['svg to png', 'convert svg', 'svg converter', 'vector to png'],
  icon: 'FileImage',
  isClientOnly: true,
  features: ['Vector → raster', 'Local', 'Instant'],
  relatedTools: ['image-filter', 'image-converter', 'avif-converter'],

  howTo: [
    'Open SVG to PNG in your browser — no install, no signup.',
    'Add the image you want to work with (drag & drop or pick a file).',
    'Adjust any options, then let it run locally on your device.',
    'Download the result instantly. Your image never leaves your computer.',
  ],
  faqs: [
    { q: 'Is SVG to PNG free?', a: 'Yes, SVG to PNG is 100% free and runs entirely in your browser.' },
    { q: 'Are my images uploaded to a server?', a: 'No. Images are processed locally in your browser for full privacy — they never leave your device.' },
    { q: 'What formats are supported?', a: 'Common formats such as JPG, PNG, WebP and more, depending on the tool.' },
    { q: 'Do I need to install anything?', a: 'No. SVG to PNG works in any modern browser, no installation needed.' },
  ],
};