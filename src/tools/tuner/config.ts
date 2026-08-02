import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'tuner',
  name: 'Guitar Tuner',
  description: 'Tune a guitar, bass or violin with your microphone.',
  longDescription: 'A chromatic tuner that listens through your mic, detects the fundamental frequency with the YIN algorithm, and shows the nearest note, cents and each guitar string’s target pitch. Designed for single-note tuning; audio is analysed locally.',
  category: 'audio',
  keywords: ['guitar tuner', 'online tuner', 'chromatic tuner', 'microphone tuner'],
  icon: 'Mic',
  isClientOnly: true,
  features: ['Chromatic pitch', 'Guitar string targets', 'YIN detection', 'Local only'],
  relatedTools: ['metronome', 'mic-test'],
  howTo: ['Add your audio file (or allow mic/camera).', 'The tool processes it on your device.', 'Preview or download the result.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is Guitar Tuner free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};