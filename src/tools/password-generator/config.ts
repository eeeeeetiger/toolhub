import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'password-generator',
  name: 'Password Generator',
  description:
    'Generate strong, random and secure passwords with custom length and character options — free and private.',
  longDescription:
    'Create strong, unpredictable passwords instantly. Choose the length, mix uppercase, lowercase, numbers and symbols, and optionally exclude look-alike characters. A live strength meter shows how secure each password is, and everything is generated locally using your browser\'s cryptographic randomness — nothing is ever sent to a server.',
  category: 'utility',
  keywords: ['password generator', 'strong password', 'random password', 'secure password generator', 'create password'],
  icon: 'KeyRound',
  isClientOnly: true,
  features: ['Cryptographically secure', 'Custom length & sets', 'Exclude ambiguous chars', 'Strength meter'],
  relatedTools: ['qr-code-generator', 'uuid-generator'],

  howTo: [
    'Open Password Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Password Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Password Generator runs entirely on your device.' },
  ],
};