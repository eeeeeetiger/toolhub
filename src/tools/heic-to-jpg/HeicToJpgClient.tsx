'use client';

import ImageConverterClient from '@/tools/image-converter/ImageConverterClient';

export default function HeicToJpgClient() {
  return <ImageConverterClient lockedTarget="jpg" />;
}
