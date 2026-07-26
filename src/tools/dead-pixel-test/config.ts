import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'dead-pixel-test',
  name: 'Dead Pixel Test',
  description: 'Find stuck or dead pixels with full-screen color panels.',
  longDescription: 'Cycle through solid colors to spot dead or stuck pixels on your screen. The dead pixel test needs no software install.',
  category: 'utility',
  keywords: ['dead pixel test', 'stuck pixel test', 'pixel test', 'screen test'],
  icon: 'Monitor',
  isClientOnly: true,
  features: ['Solid colors', 'No install', 'Quick check'],
  relatedTools: ['keyboard-test', 'mouse-test'],
  howTo: ['Open the tester and allow access if prompted.', 'Interact with your device to see the live readout.', 'Use the result to confirm your hardware works.'],
  addedAt: '2026-07-21',
};
