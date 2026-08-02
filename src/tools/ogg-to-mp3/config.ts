import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'ogg-to-mp3',
  name: 'OGG to MP3',
  description: 'Convert OGG audio to MP3 in your browser.',
  longDescription: 'Change OGG files into MP3 for broader device support. OGG to MP3 runs entirely on your device.',
  category: 'audio',
  keywords: ['ogg to mp3', 'convert ogg to mp3', 'ogg to mp3 converter', 'ogg mp3'],
  icon: 'Music',
  isClientOnly: true,
  features: ['OGG → MP3', 'Local only', 'No upload'],
  relatedTools: ['audio-converter', 'flac-to-mp3'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is OGG to MP3 free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};