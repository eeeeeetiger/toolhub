'use client';

import AudioConvertCore from '@/tools/_shared/audio-convert-core';

export default function M4aToMp3Client() {
  return <AudioConvertCore lockedTarget="mp3" accept="audio/*,.m4a" />;
}
