import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'image-to-pdf',
  name: 'Image to PDF',
  description: 'Turn JPG and PNG images into a single PDF. In your browser.',
  longDescription:
    'Image to PDF builds a clean PDF from your photos and graphics. Add several JPG or PNG files, arrange them in order, and each image becomes one page. Choose to keep the original image proportions or fit everything to A4. Processed locally with pdf-lib — no uploads.',
  category: 'pdf',
  keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'photos to pdf', 'convert images to pdf'],
  icon: 'FileImage',
  isClientOnly: true,
  features: ['JPG & PNG support', 'Multi-image order', 'Original or A4 size', 'Private & secure'],
  relatedTools: ['pdf-to-image', 'pdf-merge'],
};
