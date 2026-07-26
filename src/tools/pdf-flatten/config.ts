import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-flatten',
  name: 'Flatten PDF',
  description: 'Flatten form fields into the page so they can’t be edited.',
  longDescription: 'Turn fillable PDF form fields into static content. Great for locking a signed or completed form before sharing. Runs locally with pdf-lib.',
  category: 'pdf',
  keywords: ['flatten pdf', 'flatten form', 'lock pdf form', 'pdf flatten'],
  icon: 'Layers',
  isClientOnly: true,
  features: ['Lock forms', 'Local', 'Keeps layout'],
  relatedTools: ['pdf-watermark', 'pdf-stamp', 'pdf-encrypt'],
};
