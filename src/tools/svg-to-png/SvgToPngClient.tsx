'use client';

import ImageConverterClient from '@/tools/image-converter/ImageConverterClient';

export default function SvgToPngClient() {
  return <ImageConverterClient lockedTarget="png" />;
}
