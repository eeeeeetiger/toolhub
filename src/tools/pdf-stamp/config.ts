import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-stamp',
  name: 'PDF Stamp',
  description: 'Stamp an image or text onto every page.',
  longDescription: 'Place an image (e.g. a signature or seal) or a text label like APPROVED in a corner of every page. Processed locally with pdf-lib.',
  category: 'pdf',
  keywords: ['pdf stamp', 'stamp pdf', 'image stamp pdf', 'signature pdf'],
  icon: 'Stamp',
  isClientOnly: true,
  features: ['Image or text', '4 positions', 'Local'],
  relatedTools: ['pdf-watermark', 'pdf-flatten', 'pdf-encrypt'],
};
