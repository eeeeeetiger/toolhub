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

  howTo: [
    'Open Add Page Numbers to PDF in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is Add Page Numbers to PDF free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};