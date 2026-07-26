import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-watermark',
  name: 'PDF Watermark',
  description: 'Add a tiled text watermark to every page.',
  longDescription: 'Stamp a faint, diagonal text watermark (like CONFIDENTIAL or DRAFT) across all pages of a PDF. Everything stays on your device.',
  category: 'pdf',
  keywords: ['pdf watermark', 'add watermark to pdf', 'watermark pdf', 'pdf stamp text'],
  icon: 'Droplets',
  isClientOnly: true,
  features: ['Tiled watermark', 'Custom text', 'Local'],
  relatedTools: ['pdf-stamp', 'pdf-flatten', 'pdf-encrypt'],
};
