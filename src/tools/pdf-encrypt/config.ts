import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-encrypt',
  name: 'PDF Encrypt',
  description: 'Add a password and permissions to protect a PDF. In your browser.',
  longDescription:
    'PDF Encrypt locks a document with an open password so only people who know it can view the file. Optionally set a separate permissions password to block printing or copying. Encryption happens locally with pdf-lib — your file and password never leave the device.',
  category: 'pdf',
  keywords: ['encrypt pdf', 'password protect pdf', 'secure pdf', 'lock pdf', 'pdf password'],
  icon: 'Lock',
  isClientOnly: true,
  features: ['Open password', 'Permissions password', 'Restrict print / copy', 'Private & secure'],
  relatedTools: ['pdf-decrypt', 'pdf-merge'],

  howTo: [
    'Open PDF Encrypt in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Encrypt free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};