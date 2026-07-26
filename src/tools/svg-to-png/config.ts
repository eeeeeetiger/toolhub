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
};
