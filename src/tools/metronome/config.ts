import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'metronome',
  name: 'Metronome',
  description: 'A precise metronome for practice — runs in your browser.',
  longDescription: 'Keep time with an adjustable metronome from 30 to 250 BPM. The metronome generates clicks with the Web Audio API, no install.',
  category: 'audio',
  keywords: ['metronome', 'online metronome', 'beat metronome', 'practice metronome'],
  icon: 'Music',
  isClientOnly: true,
  features: ['30–250 BPM', 'Web Audio', 'No install'],
  relatedTools: ['tuner', 'white-noise-generator'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',
};
