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

  howTo: [
    'Open Fancy Text Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Fancy Text Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Fancy Text Generator runs entirely on your device.' },
  ],
};