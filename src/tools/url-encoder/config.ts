import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'url-encoder',
  name: 'URL Encode / Decode',
  description:
    'Encode text for safe use in URLs or decode URL-encoded strings back to readable text.',
  longDescription:
    'URL Encode / Decode converts text to and from percent-encoding so it can be safely used in query strings and paths. It uses the standard encodeURIComponent / decodeURIComponent rules and handles UTF-8, making it handy for building links, debugging APIs and inspecting request parameters.',
  category: 'developer',
  keywords: ['url encoder', 'url decoder', 'encode url', 'decode url online', 'percent encoding'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Encode URI component', 'Decode', 'UTF-8 safe', 'One-click copy'],
  relatedTools: ['base64', 'jwt-decoder'],
};
