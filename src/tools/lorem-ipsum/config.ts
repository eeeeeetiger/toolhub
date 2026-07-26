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
};
