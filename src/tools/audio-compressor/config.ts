import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-compressor',
  name: 'Audio Compressor',
  description: 'Shrink audio file size by re-encoding to MP3 — right in your browser, no upload.',
  longDescription:
    'Make big audio files small enough to email or upload. Audio Compressor re-encodes your audio to MP3 at a bitrate you choose, all in your browser with ffmpeg.wasm. Your file stays on your device the whole time — private and free.',
  category: 'audio',
  keywords: ['audio compressor', 'compress audio', 'reduce audio file size', 'mp3 compressor'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Smaller files', 'Adjustable bitrate', '100% local'],
  relatedTools: ['audio-converter', 'm4a-to-mp3'],

  howTo: [
    'Open Audio Compressor in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Audio Compressor free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};