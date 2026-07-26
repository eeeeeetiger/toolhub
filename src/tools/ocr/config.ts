import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'ocr',
  name: 'Image to Text (OCR)',
  description: 'Extract text from images with OCR.',
  longDescription: 'Read text out of screenshots, scanned docs and photos using in-browser OCR. The recognition model loads on demand; your images stay on your device.',
  category: 'image',
  keywords: ['ocr', 'image to text', 'extract text from image', 'photo to text'],
  icon: 'ScanText',
  isClientOnly: true,
  features: ['Text extraction', 'On-device', 'Copy result'],
  relatedTools: ['svg-to-png', 'image-filter', 'pdf-extract-text'],
};
