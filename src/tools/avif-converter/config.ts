import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'avif-converter',
  name: 'AVIF Converter',
  description: 'Convert images to and from AVIF.',
  longDescription: 'Make modern, tiny AVIF files from PNG/JPG/WebP (when your browser supports it), or convert AVIF back to a widely compatible format. Runs locally.',
  category: 'image',
  keywords: ['avif converter', 'to avif', 'avif to png', 'avif image'],
  icon: 'ImageDown',
  isClientOnly: true,
  features: ['Modern format', 'Local', 'PNG fallback'],
  relatedTools: ['image-converter', 'heic-to-jpg', 'svg-to-png'],
};
