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

  howTo: [
    'Open PDF Reorganize in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Reorganize free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};