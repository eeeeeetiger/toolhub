import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-decrypt',
  name: 'PDF Decrypt',
  description: 'Remove a password from a PDF when you know it. In your browser.',
  longDescription:
    'PDF Decrypt takes a password-protected PDF and, using the password you provide, saves an unprotected copy you can open anywhere. Enter the correct open password and download the unlocked file. Everything runs locally with pdf-lib — your password is never sent anywhere.',
  category: 'pdf',
  keywords: ['decrypt pdf', 'unlock pdf', 'remove pdf password', 'pdf password remover'],
  icon: 'KeyRound',
  isClientOnly: true,
  features: ['Remove open password', 'Needs known password', 'Instant unlock', 'Private & secure'],
  relatedTools: ['pdf-encrypt', 'pdf-merge'],

  howTo: [
    'Open PDF Decrypt in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Decrypt free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};