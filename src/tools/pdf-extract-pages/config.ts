import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-extract-pages',
  name: 'PDF Extract Pages',
  description: 'Extract selected pages from a PDF into a new single document. In your browser.',
  longDescription:
    'PDF Extract Pages pulls the pages you choose out of a PDF and saves them as one new document. Pick pages by clicking, or type a range like 1,3,5-9. Great for grabbing the chapters you actually need. Fully client-side with pdf-lib — nothing is uploaded.',
  category: 'pdf',
  keywords: ['extract pdf pages', 'pdf page extractor', 'save pdf pages', 'pull pages from pdf'],
  icon: 'Layers',
  isClientOnly: true,
  features: ['Pick pages visually', 'Range input (1,3,5-9)', 'One clean output', 'Private & secure'],
  relatedTools: ['pdf-merge', 'pdf-split', 'pdf-reorganize'],

  howTo: [
    'Open PDF Extract Pages in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Extract Pages free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};