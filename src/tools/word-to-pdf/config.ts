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
};
