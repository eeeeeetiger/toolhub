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
};
