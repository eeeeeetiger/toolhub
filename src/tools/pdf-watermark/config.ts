import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-watermark',
  name: 'PDF Watermark',
  description: 'Add a tiled text watermark to every page.',
  longDescription: 'Stamp a faint, diagonal text watermark (like CONFIDENTIAL or DRAFT) across all pages of a PDF. Everything stays on your device.',
  category: 'pdf',
  keywords: ['pdf watermark', 'add watermark to pdf', 'watermark pdf', 'pdf stamp text'],
  icon: 'Droplets',
  isClientOnly: true,
  features: ['Tiled watermark', 'Custom text', 'Local'],
  relatedTools: ['pdf-stamp', 'pdf-flatten', 'pdf-encrypt'],

  howTo: [
    'Open PDF Watermark in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Watermark free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};