import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'diff-viewer',
  name: 'Text Diff Viewer',
  description:
    'Compare two versions of text side by side and highlight what changed — free and instant.',
  longDescription:
    'Paste an original and a revised text to see exactly what changed. Text Diff Viewer highlights added lines in green and removed lines in red, and reports the number of insertions and deletions — handy for reviewing edits, drafts and copy updates without installing anything.',
  category: 'text',
  keywords: ['text diff', 'compare text online', 'find differences in text', 'side by side compare', 'diff viewer'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Line diff', 'Add/remove highlight', 'Change count', 'Side by side'],
  relatedTools: ['text-cleaner', 'word-counter'],

  howTo: [
    'Open Text Diff Viewer in your browser.',
    'Paste or type your text into the box.',
    'Get the result instantly — your text stays on your device.',
  ],
  faqs: [
    { q: 'Is Text Diff Viewer free?', a: 'Yes, it is free and private.' },
    { q: 'Is my text uploaded?', a: 'No. Your text stays on your device and is processed locally.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work with large text?', a: 'Yes. Processing happens in your browser, so your text never leaves your computer.' },
  ],
};