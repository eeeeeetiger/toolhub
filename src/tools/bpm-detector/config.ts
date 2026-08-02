import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'bpm-detector',
  name: 'BPM Detector',
  description: 'Estimate the tempo (BPM) of any song or beat.',
  longDescription:
    'Drop in a track and get an estimated beats-per-minute reading. This tool uses web-audio-beat-detector in the browser with a 40–200 BPM range, so slow ballads are not misread as double-time tempos. Everything is analyzed locally on your device.',
  category: 'audio',
  keywords: ['bpm detector', 'tempo finder', 'detect bpm', 'beats per minute'],
  icon: 'Activity',
  isClientOnly: true,
  features: ['Estimate BPM', 'No upload', 'Instant'],
  relatedTools: ['audio-speed', 'reverse-audio', 'audio-converter'],

  howTo: [
    'Open BPM Detector in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is BPM Detector free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};