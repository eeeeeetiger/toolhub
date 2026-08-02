import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'markdown-to-pdf',
  name: 'Markdown to PDF',
  description: 'Turn Markdown into a clean PDF.',
  longDescription: 'Write Markdown with headings, bold and bullet lists and export a simple, readable PDF. Rendered locally with pdf-lib — no server.',
  category: 'documents',
  keywords: ['markdown to pdf', 'md to pdf', 'convert markdown', 'markdown pdf'],
  icon: 'FileText',
  isClientOnly: true,
  features: ['Headings & lists', 'Local', 'pdf-lib'],
  relatedTools: ['word-to-pdf', 'ppt-to-pdf', 'csv-to-json'],

  howTo: [
    'Open Markdown to PDF in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Markdown to PDF free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};