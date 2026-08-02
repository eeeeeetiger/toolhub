import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'signature-maker',
  name: 'Signature Maker',
  description: 'Draw your signature and download it as a PNG.',
  longDescription: 'Create a clean signature image for documents. The signature maker draws on a canvas and exports a PNG — everything stays in your browser.',
  category: 'documents',
  keywords: ['signature maker', 'online signature', 'e signature', 'draw signature'],
  icon: 'PenTool',
  isClientOnly: true,
  features: ['Draw & export', 'PNG', 'Local only'],
  relatedTools: ['pdf-watermark', 'pdf-stamp'],
  howTo: ['Draw or enter your content in the tool.', 'Everything stays in your browser.', 'Download the exported file.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Signature Maker free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};