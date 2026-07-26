import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'fade-in-out',
  name: 'Audio Fade In / Out',
  description: 'Add smooth fade-in and fade-out to any audio clip locally.',
  longDescription:
    'Apply a gentle fade at the start or end of your track to avoid hard clicks. Everything runs in your browser — nothing is uploaded. Download the result as MP3 or WAV.',
  category: 'audio',
  keywords: ['fade audio', 'fade in', 'fade out', 'audio fade'],
  icon: 'ArrowDownToLine',
  isClientOnly: true,
  features: ['Fade in & out', 'MP3 or WAV output', 'Private processing'],
  relatedTools: ['reverse-audio', 'volume-normalizer', 'audio-speed'],
};
