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
};
