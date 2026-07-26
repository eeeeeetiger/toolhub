import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'base64',
  name: 'Base64 Encode / Decode',
  description:
    'Encode text to Base64 or decode Base64 back to text instantly in your browser. Supports UTF-8.',
  longDescription:
    'Base64 tool encodes strings to Base64 and decodes Base64 strings back to readable text. It handles UTF-8 correctly, so emojis and non-Latin characters are preserved. Use it for debugging tokens, embedding data URIs or working with APIs — fully client-side and private.',
  category: 'developer',
  keywords: ['base64 encoder', 'base64 decoder', 'encode base64', 'decode base64 online', 'base64 to text'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Encode text', 'Decode Base64', 'UTF-8 safe', 'One-click copy'],
  relatedTools: ['url-encoder', 'jwt-decoder'],
};
