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

  howTo: [
    'Open PDF Stamp in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Stamp free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};