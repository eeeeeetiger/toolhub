import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-cutter',
  name: 'Audio Cutter',
  description: 'Trim and cut audio to any start and end point — right in your browser, no upload.',
  longDescription:
    'Slice any audio clip to the exact part you need. Audio Cutter runs fully in your browser: load a file, set the start and end times in seconds, and export just that segment as MP3 or WAV. No uploads, no waiting, no watermarks.',
  category: 'audio',
  keywords: ['audio cutter', 'trim audio', 'cut audio', 'audio trimmer', 'audio splitter'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Precise trim', 'MP3 / WAV', '100% local'],
  relatedTools: ['audio-merger', 'audio-converter'],

  howTo: [
    'Open Audio Cutter in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Audio Cutter free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};