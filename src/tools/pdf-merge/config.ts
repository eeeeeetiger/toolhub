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
};
