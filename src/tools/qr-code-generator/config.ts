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

  howTo: [
    'Open QR Code Generator in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is QR Code Generator free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, QR Code Generator runs entirely on your device.' },
  ],
};