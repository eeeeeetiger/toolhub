import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'qr-code-generator',
  name: 'QR Code Generator',
  description:
    'Create custom QR codes from any text or URL — pick colors, error correction and download as PNG or SVG.',
  longDescription:
    'Generate high-quality QR codes for links, Wi-Fi, contact details or plain text in seconds. Choose the size and error-correction level, customize the foreground and background colors, and download the result as a crisp PNG or scalable SVG. Everything is generated locally in your browser, so your data is never uploaded.',
  category: 'utility',
  keywords: ['qr code generator', 'create qr code', 'qr code maker', 'url to qr code', 'free qr code'],
  icon: 'QrCode',
  isClientOnly: true,
  features: ['Text or URL', 'Custom colors', 'PNG & SVG download', 'Adjustable error correction'],
  relatedTools: ['password-generator', 'unit-converter'],
};
