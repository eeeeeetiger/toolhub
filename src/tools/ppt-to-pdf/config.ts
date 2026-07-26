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
};
