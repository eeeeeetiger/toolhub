import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-rotate',
  name: 'Rotate PDF',
  description: 'Rotate all pages of a PDF by 90°, 180° or 270° — fix sideways scans in one click.',
  longDescription:
    'Scanned a document the wrong way? Upload the PDF and rotate every page by 90, 180 or 270 degrees. The tool uses pdf-lib to rewrite the page rotation, so layout and text stay intact — only the orientation changes. Everything happens locally in your browser.',
  category: 'pdf',
  keywords: ['rotate pdf', 'rotate pdf pages', 'fix sideways pdf', 'turn pdf', 'pdf rotate 90'],
  icon: 'RotateCw',
  isClientOnly: true,
  features: ['90 / 180 / 270°', 'All pages', 'Keeps layout', 'Local only'],
  relatedTools: ['pdf-page-numbers', 'pdf-extract-pages'],
};
