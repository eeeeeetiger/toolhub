import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'hash-generator',
  name: 'Hash Generator',
  description: 'Compute MD5, SHA-1/256/384/512 and CRC32 of text or files.',
  longDescription: 'Generate multiple hash checksums for a string or file using Web Crypto and a local MD5 implementation. Files never leave your device.',
  category: 'utility',
  keywords: ['hash generator', 'md5 generator', 'sha256', 'checksum', 'crc32'],
  icon: 'Hash',
  isClientOnly: true,
  features: ['MD5/SHA/CRC32', 'Text or file', 'Private'],
  relatedTools: ['timezone-converter', 'random-generator', 'lorem-ipsum'],

  howTo: [
    'Open Hash Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Hash Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Hash Generator runs entirely on your device.' },
  ],
};