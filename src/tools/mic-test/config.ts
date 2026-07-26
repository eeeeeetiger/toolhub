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
};
