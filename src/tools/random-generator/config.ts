import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'random-generator',
  name: 'Random Generator',
  description: 'Roll dice, flip coins, make numbers, UUIDs and passwords.',
  longDescription: 'A quick toolbox for randomness: pick a number in a range, roll a die, flip a coin, generate a UUID or a strong password. All client-side.',
  category: 'utility',
  keywords: ['random generator', 'dice roller', 'coin flip', 'uuid generator', 'password'],
  icon: 'Dices',
  isClientOnly: true,
  features: ['Dice / coin', 'UUID / password', 'Local'],
  relatedTools: ['password-generator', 'lorem-ipsum', 'hash-generator'],

  howTo: [
    'Open Random Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Random Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Random Generator runs entirely on your device.' },
  ],
};