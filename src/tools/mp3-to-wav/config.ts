import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mp3-to-wav',
  name: 'MP3 to WAV',
  description: 'Convert MP3 to uncompressed WAV for editing.',
  longDescription: 'Get a WAV version of an MP3 for studio or editing work. MP3 to WAV runs locally in your browser.',
  category: 'audio',
  keywords: ['mp3 to wav', 'convert mp3 to wav', 'mp3 to wav converter', 'mp3 wav'],
  icon: 'Music',
  isClientOnly: true,
  features: ['MP3 → WAV', 'Uncompressed', 'Local only'],
  relatedTools: ['audio-converter', 'wav-to-mp3'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is MP3 to WAV free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};