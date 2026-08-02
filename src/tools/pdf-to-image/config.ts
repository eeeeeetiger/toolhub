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

  howTo: [
    'Open PDF to Image in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF to Image free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};