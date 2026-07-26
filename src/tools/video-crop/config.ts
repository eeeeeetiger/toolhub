import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'video-crop',
  name: 'Video Crop',
  description: 'Crop the frame of a video to remove black bars or change aspect ratio — all in your browser.',
  longDescription:
    'Crop videos without uploading them to any server. Video Crop runs entirely in your browser using ffmpeg.wasm: cut away black bars or carve out a custom box by entering width, height and the top-left corner in pixels. Your video never leaves your device.',
  category: 'video',
  keywords: ['video crop', 'crop video', 'remove black bars', 'trim frame', 'video aspect ratio'],
  icon: 'Video',
  isClientOnly: true,
  features: [
    'Remove black bars',
    'Custom box',
    'Keep ratio',
    'Local only',
  ],
};
