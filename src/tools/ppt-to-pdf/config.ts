import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'ppt-to-pdf',
  name: 'PowerPoint to PDF',
  description: 'Convert a .pptx deck into a PDF.',
  longDescription: 'Pull the text from each slide of a PowerPoint file and render it as a PDF, one slide per section. Runs locally in your browser.',
  category: 'documents',
  keywords: ['ppt to pdf', 'pptx to pdf', 'powerpoint to pdf', 'pptx pdf'],
  icon: 'Presentation',
  isClientOnly: true,
  features: ['Per-slide text', 'Local', 'No upload'],
  relatedTools: ['word-to-pdf', 'markdown-to-pdf', 'excel-to-pdf'],

  howTo: [
    'Open PowerPoint to PDF in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is PowerPoint to PDF free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};