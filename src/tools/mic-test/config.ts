import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'mic-test',
  name: 'Microphone Test',
  description: 'Test your microphone with a live input level meter.',
  longDescription:
    'Check that your mic is working and see a real-time level meter plus the list of input devices detected by your browser. Nothing is recorded or uploaded.',
  category: 'audio',
  keywords: ['mic test', 'microphone test', 'test microphone', 'input level'],
  icon: 'Mic',
  isClientOnly: true,
  features: ['Live level meter', 'List devices', 'No recording'],
  relatedTools: ['audio-recorder', 'audio-converter'],

  howTo: [
    'Open Microphone Test in your browser.',
    'Add your audio file.',
    'Adjust options, then process it locally with Web Audio / ffmpeg.wasm.',
    'Download the result — nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Microphone Test free?', a: 'Yes, all audio tools on Offline ToolHub are free.' },
    { q: 'Are my audio files uploaded?', a: 'No. Audio is processed locally in your browser with Web Audio and ffmpeg.wasm.' },
    { q: 'What audio formats are supported?', a: 'MP3, WAV, M4A, OGG and FLAC, depending on the tool.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};