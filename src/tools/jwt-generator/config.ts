import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'jwt-generator',
  name: 'JWT Generator',
  description: 'Create a signed HS256 JWT from header, payload and secret.',
  longDescription: 'Build a JSON Web Token locally: enter the header and payload as JSON, provide a secret, and sign with HMAC-SHA256. Your secret never leaves the browser.',
  category: 'developer',
  keywords: ['jwt generator', 'create jwt', 'sign jwt', 'hs256 token'],
  icon: 'KeyRound',
  isClientOnly: true,
  features: ['HS256 sign', 'Local secret', 'Copy token'],
  relatedTools: ['jwt-decoder', 'base-converter', 'cron-parser'],
};
