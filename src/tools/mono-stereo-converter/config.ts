import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mono-stereo-converter',
  name: 'Mono / Stereo Converter',
  description: 'Convert audio between mono and stereo channels.',
  longDescription:
    'Turn a stereo track into mono to save space and fix phase issues, or expand mono into stereo. Processed locally with ffmpeg.wasm.',
  category: 'audio',
  keywords: ['mono to stereo', 'stereo to mono', 'channel converter', 'audio channels'],
  icon: 'AudioLines',
  isClientOnly: true,
  features: ['Mono ⇄ stereo', 'Local & fast', 'Works with most formats'],
  relatedTools: ['audio-speed', 'volume-normalizer', 'audio-converter'],
};
