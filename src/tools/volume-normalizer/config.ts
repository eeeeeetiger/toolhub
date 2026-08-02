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

  howTo: [
    'Open Volume Normalizer in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Volume Normalizer free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};