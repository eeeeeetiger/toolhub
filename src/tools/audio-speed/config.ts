import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-speed',
  name: 'Change Audio Speed',
  description: 'Speed up or slow down audio without changing the pitch.',
  longDescription:
    'Adjust playback tempo from 0.5× to 2× while keeping the original pitch — perfect for slow practice or quick review. Processed locally via ffmpeg.wasm.',
  category: 'audio',
  keywords: ['audio speed', 'change tempo', 'slow down audio', 'speed up audio'],
  icon: 'Gauge',
  isClientOnly: true,
  features: ['Tempo, pitch preserved', '0.5×–2×', 'Local processing'],
  relatedTools: ['pitch-shifter', 'reverse-audio', 'audio-cutter'],
};
