import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'fancy-text-generator',
  name: 'Fancy Text Generator',
  description:
    'Turn plain text into stylish Unicode fonts — 𝔣𝔯𝔞𝔨𝔱𝔲𝔯, 𝓈𝒸𝓇𝒾𝓅𝓉, Ⓒⓘⓡⓒⓛⓔⓓ, bold and more for social posts.',
  longDescription:
    'Make your captions, bios and messages stand out. Type any text and instantly see it rendered in a dozen Unicode styles — bold, italic, gothic, script, circled, squared, full-width and more. Click any style to copy it straight to your clipboard. Works fully offline, no account needed.',
  category: 'utility',
  keywords: ['fancy text generator', 'stylish text', 'cool fonts copy paste', 'unicode text', 'gothic text generator'],
  icon: 'Type',
  isClientOnly: true,
  features: ['12+ styles', 'One-click copy', 'Social-ready', 'No signup'],
  relatedTools: ['emoji-picker', 'color-picker'],
};
