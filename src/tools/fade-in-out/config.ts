import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'fade-in-out',
  name: 'Audio Fade In / Out',
  description: 'Add smooth fade-in and fade-out to any audio clip locally.',
  longDescription:
    'Apply a gentle fade at the start or end of your track to avoid hard clicks. Everything runs in your browser — nothing is uploaded. Download the result as MP3 or WAV.',
  category: 'audio',
  keywords: ['fade audio', 'fade in', 'fade out', 'audio fade'],
  icon: 'ArrowDownToLine',
  isClientOnly: true,
  features: ['Fade in & out', 'MP3 or WAV output', 'Private processing'],
  relatedTools: ['reverse-audio', 'volume-normalizer', 'audio-speed'],

  howTo: [
    'Open Audio Fade In / Out in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Audio Fade In / Out free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};