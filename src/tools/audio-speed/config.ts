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

  howTo: [
    'Open Change Audio Speed in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Change Audio Speed free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};