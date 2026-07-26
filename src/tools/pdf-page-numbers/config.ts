import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-page-numbers',
  name: 'Add Page Numbers to PDF',
  description: 'Add page numbers to every page of a PDF — choose position, start number and style.',
  longDescription:
    'Number your PDF pages in seconds. Upload a document, pick where the numbers go (footer center, left, right or header), set the starting number, font size and color, and download the numbered file. Handy for reports, manuscripts and shared documents. Processed entirely in your browser with pdf-lib.',
  category: 'pdf',
  keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf page numbering', 'page numbers footer', 'insert page numbers'],
  icon: 'Hash',
  isClientOnly: true,
  features: ['Position options', 'Start number', 'Color & size', 'Local processing'],
  relatedTools: ['pdf-rotate', 'pdf-extract-pages'],
};
