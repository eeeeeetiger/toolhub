import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-merge',
  name: 'PDF Merge',
  description:
    'Combine multiple PDF files into a single document in your browser. No upload, no limits.',
  longDescription:
    'PDF Merge joins several PDF files into one document while keeping your files on your device. Select the PDFs you want to combine, arrange them in order, and download the merged result. Powered by pdf-lib and running entirely client-side, so confidential documents are never sent to a server.',
  category: 'pdf',
  keywords: ['merge pdf', 'combine pdf', 'pdf merger', 'join pdf files', 'pdf merge online'],
  icon: 'FileText',
  isClientOnly: true,
  features: ['Merge multiple PDFs', 'In-browser (pdf-lib)', 'Private & secure', 'Instant download'],
  relatedTools: ['image-compressor'],

  howTo: [
    'Open PDF Merge in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Merge free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};