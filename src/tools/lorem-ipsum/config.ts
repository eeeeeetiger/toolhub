import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  description: 'Generate placeholder text for designs and mockups.',
  longDescription: 'Create as many paragraphs of classic Lorem Ipsum as you need for wireframes, demos and layouts. Instant and local.',
  category: 'utility',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'lipsum'],
  icon: 'FileText',
  isClientOnly: true,
  features: ['Any length', 'Instant', 'Copy ready'],
  relatedTools: ['random-generator', 'timezone-converter', 'hash-generator'],

  howTo: [
    'Open Lorem Ipsum Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Lorem Ipsum Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Lorem Ipsum Generator runs entirely on your device.' },
  ],
};