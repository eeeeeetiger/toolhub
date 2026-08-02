import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'flac-to-mp3',
  name: 'FLAC to MP3',
  description: 'Convert lossless FLAC to MP3 for universal playback.',
  longDescription: 'Make FLAC files play anywhere by converting to MP3. FLAC to MP3 processes locally in your browser — no upload.',
  category: 'audio',
  keywords: ['flac to mp3', 'convert flac to mp3', 'flac to mp3 converter', 'flac mp3'],
  icon: 'Music',
  isClientOnly: true,
  features: ['FLAC → MP3', 'Universal playback', 'Local only'],
  relatedTools: ['audio-converter', 'wav-to-mp3'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is FLAC to MP3 free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};