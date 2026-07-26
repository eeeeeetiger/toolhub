import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'json-formatter',
  name: 'JSON Formatter',
  description:
    'Format, validate and minify JSON with syntax error highlighting. Free online tool for developers.',
  longDescription:
    'Paste your JSON to format it with proper indentation, validate its structure, or minify it for production. JSON Formatter shows clear error messages with line numbers when input is invalid, and supports one-click copy of the result. Everything runs in your browser — ideal for debugging APIs and configuring data files.',
  category: 'developer',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json', 'format json online', 'json parser'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Format & beautify', 'Validate with errors', 'Minify', 'Copy result'],
  relatedTools: ['base64', 'jwt-decoder'],
};
