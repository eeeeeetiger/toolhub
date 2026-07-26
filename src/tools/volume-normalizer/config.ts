import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'volume-normalizer',
  name: 'Volume Normalizer',
  description: 'Boost quiet audio to a consistent, comfortable volume.',
  longDescription:
    'Normalize the peak level of your recording so it plays at a steady, even volume. Processed locally in your browser and exported as WAV or MP3.',
  category: 'audio',
  keywords: ['normalize audio', 'volume booster', 'audio normalizer', 'loudness'],
  icon: 'Volume2',
  isClientOnly: true,
  features: ['Peak normalization', 'WAV or MP3 output', 'Local & private'],
  relatedTools: ['fade-in-out', 'audio-speed', 'audio-compressor'],
};
