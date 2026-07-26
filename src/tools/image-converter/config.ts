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
};
