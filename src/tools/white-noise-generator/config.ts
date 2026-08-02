import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'white-noise-generator',
  name: 'White Noise Generator',
  description: 'Play white, pink or brown noise for focus, sleep or masking sound.',
  longDescription: 'Generate white, pink, or brown noise instantly in your browser with adjustable volume. White noise is best for masking sharp sounds and staying focused; pink noise is softer and often used for sleep or tinnitus relief; brown noise is deeper and rumbling, ideal for deep sleep or calming infants. No files, no upload.',
  category: 'audio',
  keywords: ['white noise', 'pink noise', 'brown noise', 'noise generator', 'focus noise'],
  icon: 'Volume2',
  isClientOnly: true,
  features: ['White / Pink / Brown', 'Adjustable volume', 'Local only'],
  relatedTools: ['metronome', 'tuner'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is White Noise Generator free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};