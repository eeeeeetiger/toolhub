import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'morse-code-converter',
  name: 'Morse Code Converter',
  description: 'Convert text to Morse code and back.',
  longDescription: 'Translate words into Morse code dots and dashes, or decode a Morse string back into text. Pure client-side fun and utility.',
  category: 'text',
  keywords: ['morse code', 'text to morse', 'morse decoder', 'morse translator'],
  icon: 'Radio',
  isClientOnly: true,
  features: ['Text → Morse', 'Morse → text', 'Local'],
  relatedTools: ['base-converter', 'text-reverser', 'html-entity-converter'],
};
