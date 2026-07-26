import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-compress',
  name: 'PDF Compress',
  description: 'Shrink a PDF file size right in your browser.',
  longDescription:
    'PDF Compress reduces the size of bulky PDFs so they are easier to email and store. It re-renders each page as an optimized image at the quality you choose, which is especially effective for scanned documents and image-heavy files. Runs entirely client-side with pdf.js and pdf-lib. Heads-up: compressing rasterizes pages, so text becomes part of the image and is no longer selectable.',
  category: 'pdf',
  keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf', 'pdf compressor'],
  icon: 'Minimize2',
  isClientOnly: true,
  features: ['Smaller file size', 'Quality control', 'Before / after size', 'Private & secure'],
  relatedTools: ['pdf-to-image', 'pdf-extract-text'],
};
