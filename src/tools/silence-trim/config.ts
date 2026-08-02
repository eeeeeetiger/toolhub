import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'silence-trim',
  name: 'Remove Silence',
  description: 'Trim leading and trailing silence from an audio file automatically.',
  longDescription:
    'Cut the dead air at the start and end of a recording so it begins and ends exactly where the sound does. Runs entirely on your device and exports WAV or MP3.',
  category: 'audio',
  keywords: ['trim silence', 'remove silence', 'cut silence', 'audio trimmer'],
  icon: 'Scissors',
  isClientOnly: true,
  features: ['Auto-detect silence', 'WAV or MP3 output', 'Private'],
  relatedTools: ['audio-cutter', 'audio-merger', 'volume-normalizer'],

  howTo: [
    'Open Remove Silence in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Remove Silence free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};