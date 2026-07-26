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
};
