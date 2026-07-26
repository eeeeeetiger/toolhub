import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-to-image',
  name: 'PDF to Image',
  description: 'Render PDF pages to PNG images. In your browser.',
  longDescription:
    'PDF to Image converts every page of a PDF into a high-quality PNG picture. Pick a zoom level for sharper output, then download each page individually or grab them all at once. Rendering uses pdf.js locally in your browser, so files stay private.',
  category: 'pdf',
  keywords: ['pdf to image', 'pdf to png', 'convert pdf to image', 'pdf page to picture'],
  icon: 'Image',
  isClientOnly: true,
  features: ['Per-page PNG', 'Zoom / quality control', 'Batch download', 'Private & secure'],
  relatedTools: ['image-to-pdf', 'pdf-extract-text', 'pdf-compress'],
};
