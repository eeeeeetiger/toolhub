import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-reorganize',
  name: 'PDF Reorganize',
  description: 'Rotate, reorder and delete pages in a PDF. All in your browser.',
  longDescription:
    'PDF Reorganize lets you tidy up any document: rotate pages 90 degrees, drag them into a new order, and remove the pages you do not need. The result is a fresh PDF with your changes applied. Powered by pdf-lib and runs entirely on your device.',
  category: 'pdf',
  keywords: ['rotate pdf', 'reorder pdf pages', 'delete pdf pages', 'organize pdf', 'pdf page manager'],
  icon: 'Shuffle',
  isClientOnly: true,
  features: ['Rotate 90° steps', 'Reorder pages', 'Delete pages', 'Private & secure'],
  relatedTools: ['pdf-merge', 'pdf-split', 'pdf-extract-pages'],
};
