import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'heic-to-jpg',
  name: 'HEIC to JPG',
  description: 'Convert iPhone HEIC / HEIF photos to JPG.',
  longDescription: 'iPhone photos are usually HEIC, which many sites reject. Convert them to JPG locally in your browser so you can upload and share anywhere.',
  category: 'image',
  keywords: ['heic to jpg', 'heif converter', 'iphone photo converter', 'convert heic'],
  icon: 'Smartphone',
  isClientOnly: true,
  features: ['iPhone photos', 'Local & private', 'High quality'],
  relatedTools: ['image-converter', 'avif-converter', 'svg-to-png'],
};
