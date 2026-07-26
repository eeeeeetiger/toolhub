import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'silence-trim',
  name: 'Remove Silence',
  description: 'Trim leading and trailing silence from an audio file automatically.',
  longDescription:
    'Cut the dead air at the start and end of a recording so it begins and ends exactly where the sound does. Runs entirely on your device and exports WAV or MP3.',
  category: 'audio',
  keywords: ['trim silence', 'remove silence', 'cut silence', 'audio trimmer'],
  icon: 'Scissors',
  isClientOnly: true,
  features: ['Auto-detect silence', 'WAV or MP3 output', 'Private'],
  relatedTools: ['audio-cutter', 'audio-merger', 'volume-normalizer'],
};
