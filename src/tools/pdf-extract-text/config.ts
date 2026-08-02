import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'pdf-extract-text',
  name: 'PDF Extract Text',
  description: 'Pull the text out of a PDF into copyable plain text. In your browser.',
  longDescription:
    'PDF Extract Text reads the text layer of a PDF and copies it into a plain-text box you can select, copy or download as a .txt file. Perfect for quotes, transcripts and data entry. Uses pdf.js locally — nothing is uploaded. Note: scanned pages without a text layer will come out empty.',
  category: 'pdf',
  keywords: ['extract text from pdf', 'pdf to text', 'copy text from pdf', 'pdf text extractor'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Plain-text output', 'Copy / download .txt', 'Local pdf.js', 'Private & secure'],
  relatedTools: ['pdf-to-image', 'pdf-compress'],

  howTo: [
    'Open PDF Extract Text in your browser.',
    'Add your PDF (or select pages / options as needed).',
    'Process it locally on your device — nothing is uploaded.',
    'Download the resulting PDF.',
  ],
  faqs: [
    { q: 'Is PDF Extract Text free?', a: 'Yes, all PDF tools are free and run in your browser.' },
    { q: 'Are my PDFs uploaded?', a: 'No. Your PDFs are processed locally on your device and never leave it.' },
    { q: 'Is there a file size limit?', a: 'Very large files may be slower because processing happens on your device, but there is no hard upload limit.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
  ],
};