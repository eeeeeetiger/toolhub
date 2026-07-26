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
};
