import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-rotate',
  name: 'Rotate PDF',
  description: 'Rotate all pages of a PDF by 90°, 180° or 270° — fix sideways scans in one click.',
  longDescription:
    'Scanned a document the wrong way? Upload the PDF and rotate every page by 90, 180 or 270 degrees. The tool uses pdf-lib to rewrite the page rotation, so layout and text stay intact — only the orientation changes. Everything happens locally in your browser.',
  category: 'pdf',
  keywords: ['rotate pdf', 'rotate pdf pages', 'fix sideways pdf', 'turn pdf', 'pdf rotate 90'],
  icon: 'RotateCw',
  isClientOnly: true,
  features: ['90 / 180 / 270°', 'All pages', 'Keeps layout', 'Local only'],
  relatedTools: ['pdf-page-numbers', 'pdf-extract-pages'],

  howTo: [
    'Open Rotate PDF in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is Rotate PDF free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};