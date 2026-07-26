import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'webcam-test',
  name: 'Webcam Test',
  description: 'Preview your webcam and check image quality before a call.',
  longDescription: 'See your camera live and switch between connected webcams. The webcam test stream stays local in your browser.',
  category: 'utility',
  keywords: ['webcam test', 'camera test', 'test my webcam', 'online webcam test'],
  icon: 'Camera',
  isClientOnly: true,
  features: ['Live preview', 'Camera switch', 'Local only'],
  relatedTools: ['mic-test', 'keyboard-test'],
  howTo: ['Open the tester and allow access if prompted.', 'Interact with your device to see the live readout.', 'Use the result to confirm your hardware works.'],
  addedAt: '2026-07-21',
};
