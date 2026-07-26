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
};
