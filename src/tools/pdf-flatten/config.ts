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

  howTo: [
    'Open Flatten PDF in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is Flatten PDF free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};