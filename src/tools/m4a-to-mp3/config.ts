import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'm4a-to-mp3',
  name: 'M4A to MP3',
  description: 'Turn M4A voice memos and audio into MP3 — right in your browser, no upload.',
  longDescription:
    'The fastest way to convert M4A files (including iPhone voice memos) into universally compatible MP3. M4A to MP3 runs entirely in your browser with ffmpeg.wasm, so your audio never leaves your device. Pick a file, choose a bitrate, and download the MP3 in seconds.',
  category: 'audio',
  keywords: ['m4a to mp3', 'convert m4a to mp3', 'iphone voice memo to mp3', 'm4a to mp3 converter'],
  icon: 'Music',
  isClientOnly: true,
  features: ['M4A → MP3', 'Adjustable bitrate', 'Local only'],
  relatedTools: ['audio-converter', 'audio-compressor'],

  howTo: [
    'Open M4A to MP3 in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is M4A to MP3 free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};