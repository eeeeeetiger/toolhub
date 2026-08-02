import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pitch-shifter',
  name: 'Pitch Shifter',
  description: 'Raise or lower the pitch of audio by semitones.',
  longDescription:
    'Shift the pitch up or down by up to an octave to match a key or create effects, without changing the length. Runs locally with ffmpeg.wasm.',
  category: 'audio',
  keywords: ['pitch shifter', 'change pitch', 'transpose audio', 'pitch changer'],
  icon: 'Music2',
  isClientOnly: true,
  features: ['±12 semitones', 'Keeps duration', 'Local'],
  relatedTools: ['audio-speed', 'reverse-audio', 'volume-normalizer'],

  howTo: [
    'Open Pitch Shifter in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Pitch Shifter free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};