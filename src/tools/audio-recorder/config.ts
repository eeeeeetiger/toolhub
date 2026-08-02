import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'audio-recorder',
  name: 'Voice Recorder',
  description: 'Record audio from your microphone and download it as MP3 or WAV — right in your browser, no upload.',
  longDescription:
    'A simple, private voice recorder that runs entirely in your browser. Hit record, capture from your microphone with the MediaRecorder API, preview the clip, and download it as an MP3 or WAV file. Nothing is uploaded to any server.',
  category: 'audio',
  keywords: ['voice recorder', 'audio recorder', 'record audio online', 'mic recorder'],
  icon: 'Music',
  isClientOnly: true,
  features: ['Mic capture', 'MP3 / WAV output', 'Live preview', 'Local only'],
  relatedTools: ['audio-cutter', 'audio-merger'],

  howTo: [
    'Open Voice Recorder in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Voice Recorder free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};