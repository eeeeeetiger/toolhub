import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-split',
  name: 'PDF Split',
  description: 'Split a PDF into separate files by page or by page ranges. Runs in your browser.',
  longDescription:
    'PDF Split breaks one PDF into several smaller files. Split every page into its own file, or define custom page ranges (for example 1-3, 5, 8-10) to group pages however you like. Everything is processed locally with pdf-lib, so your documents never leave your device.',
  category: 'pdf',
  keywords: ['split pdf', 'pdf splitter', 'break pdf into pages', 'extract pdf pages', 'pdf split online'],
  icon: 'Scissors',
  isClientOnly: true,
  features: ['Split every page', 'Custom page ranges', 'Batch download', 'Private & secure'],
  relatedTools: ['pdf-merge', 'pdf-extract-pages', 'pdf-reorganize'],

  howTo: [
    'Open PDF Split in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Split free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};