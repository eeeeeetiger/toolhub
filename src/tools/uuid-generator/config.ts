import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'uuid-generator',
  name: 'UUID Generator',
  description:
    'Generate RFC-4122 version 4 UUIDs in bulk. Create one or thousands of unique identifiers instantly.',
  longDescription:
    'UUID Generator creates cryptographically strong random UUIDs (v4) using your browser’s crypto module. Set how many you need, generate them in one click, and copy the whole list for use as database keys, request IDs or test fixtures. No server, no tracking.',
  category: 'developer',
  keywords: ['uuid generator', 'generate uuid', 'uuid v4', 'random uuid', 'uuid online'],
  icon: 'Code',
  isClientOnly: true,
  features: ['RFC-4122 v4', 'Bulk generation', 'Uppercase option', 'Copy all'],
  relatedTools: ['base64', 'jwt-decoder'],
};
