import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'reverse-audio',
  name: 'Reverse Audio',
  description: 'Flip any audio clip backwards in your browser — no upload, fully private.',
  longDescription:
    'Reverse a song, voice memo or sound effect with one click. The audio is decoded and replayed backwards entirely on your device, so your files never leave your computer. Export the result as MP3 or WAV.',
  category: 'audio',
  keywords: ['reverse audio', 'play backwards', 'audio reverser', 'reverse sound'],
  icon: 'Undo2',
  isClientOnly: true,
  features: ['Reverse in one click', 'MP3 or WAV output', 'Private & local'],
  relatedTools: ['fade-in-out', 'audio-speed', 'pitch-shifter'],

  howTo: [
    'Open Reverse Audio in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Reverse Audio free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};