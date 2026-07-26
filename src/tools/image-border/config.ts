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
};
