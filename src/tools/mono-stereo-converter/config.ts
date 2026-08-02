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

  howTo: [
    'Open Mono / Stereo Converter in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Mono / Stereo Converter free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};