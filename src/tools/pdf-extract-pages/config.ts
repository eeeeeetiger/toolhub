import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-extract-pages',
  name: 'PDF Extract Pages',
  description: 'Extract selected pages from a PDF into a new single document. In your browser.',
  longDescription:
    'PDF Extract Pages pulls the pages you choose out of a PDF and saves them as one new document. Pick pages by clicking, or type a range like 1,3,5-9. Great for grabbing the chapters you actually need. Fully client-side with pdf-lib — nothing is uploaded.',
  category: 'pdf',
  keywords: ['extract pdf pages', 'pdf page extractor', 'save pdf pages', 'pull pages from pdf'],
  icon: 'Layers',
  isClientOnly: true,
  features: ['Pick pages visually', 'Range input (1,3,5-9)', 'One clean output', 'Private & secure'],
  relatedTools: ['pdf-merge', 'pdf-split', 'pdf-reorganize'],
};
