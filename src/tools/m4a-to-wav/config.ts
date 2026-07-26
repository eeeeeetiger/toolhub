import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'm4a-to-wav',
  name: 'M4A to WAV',
  description: 'Convert M4A audio to WAV quickly and privately.',
  longDescription: 'Turn M4A files into WAV for editing and compatibility. M4A to WAV processes on your device.',
  category: 'audio',
  keywords: ['m4a to wav', 'convert m4a to wav', 'm4a to wav converter', 'm4a wav'],
  icon: 'Music',
  isClientOnly: true,
  features: ['M4A → WAV', 'Local only', 'No upload'],
  relatedTools: ['audio-converter', 'mp3-to-wav'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',
};
