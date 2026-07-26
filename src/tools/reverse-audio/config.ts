import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'reverse-audio',
  name: 'Reverse Audio',
  description: 'Flip any audio clip backwards in your browser — no upload, fully private.',
  longDescription:
    'Reverse a song, voice memo or sound effect with one click. The audio is decoded and replayed backwards entirely on your device, so your files never leave your computer. Export the result as MP3 or WAV.',
  category: 'audio',
  keywords: ['reverse audio', 'play backwards', 'audio reverser', 'reverse sound'],
  icon: 'Undo2',
  isClientOnly: true,
  features: ['Reverse in one click', 'MP3 or WAV output', 'Private & local'],
  relatedTools: ['fade-in-out', 'audio-speed', 'pitch-shifter'],
};
