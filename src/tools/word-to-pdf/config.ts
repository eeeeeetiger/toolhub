import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'word-to-pdf',
  name: 'Word to PDF',
  description: 'Convert a .docx file into a PDF.',
  longDescription: 'Extract the text from a Word document and lay it out as a PDF entirely in your browser (text content; complex formatting is simplified).',
  category: 'documents',
  keywords: ['word to pdf', 'docx to pdf', 'convert word', 'docx pdf'],
  icon: 'FileText',
  isClientOnly: true,
  features: ['Text extraction', 'Local', 'No upload'],
  relatedTools: ['pdf-to-word', 'ppt-to-pdf', 'markdown-to-pdf'],

  howTo: [
    'Open Word to PDF in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Word to PDF free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};