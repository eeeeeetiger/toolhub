import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mouse-test',
  name: 'Mouse Test',
  description: 'Test mouse buttons, double-click and scroll in your browser.',
  longDescription: 'Verify your mouse works — left, middle and right buttons, double-click and scroll wheel. The mouse test runs entirely on your device.',
  category: 'utility',
  keywords: ['mouse test', 'test mouse buttons', 'mouse click test', 'online mouse test'],
  icon: 'MousePointer',
  isClientOnly: true,
  features: ['Button test', 'Double-click', 'Scroll count'],
  relatedTools: ['keyboard-test', 'dead-pixel-test'],
  howTo: ['Open the tester and allow access if prompted.', 'Interact with your device to see the live readout.', 'Use the result to confirm your hardware works.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Mouse Test free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Mouse Test runs entirely on your device.' },
  ],
};