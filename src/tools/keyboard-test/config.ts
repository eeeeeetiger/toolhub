import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'keyboard-test',
  name: 'Keyboard Test',
  description: 'Check every key on your keyboard right in the browser.',
  longDescription: 'See which keys register when you press them. The keyboard test helps you spot stuck or unresponsive keys — no install needed.',
  category: 'utility',
  keywords: ['keyboard test', 'test keyboard keys', 'key tester', 'online keyboard test'],
  icon: 'Keyboard',
  isClientOnly: true,
  features: ['Key detection', 'No install', 'Live log'],
  relatedTools: ['mouse-test', 'dead-pixel-test'],
  howTo: ['Open the tester and allow access if prompted.', 'Interact with your device to see the live readout.', 'Use the result to confirm your hardware works.'],
  addedAt: '2026-07-21',
};
