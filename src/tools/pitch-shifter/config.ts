import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pitch-shifter',
  name: 'Pitch Shifter',
  description: 'Raise or lower the pitch of audio by semitones.',
  longDescription:
    'Shift the pitch up or down by up to an octave to match a key or create effects, without changing the length. Runs locally with ffmpeg.wasm.',
  category: 'audio',
  keywords: ['pitch shifter', 'change pitch', 'transpose audio', 'pitch changer'],
  icon: 'Music2',
  isClientOnly: true,
  features: ['±12 semitones', 'Keeps duration', 'Local'],
  relatedTools: ['audio-speed', 'reverse-audio', 'volume-normalizer'],
};
