import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'diff-viewer',
  name: 'Text Diff Viewer',
  description:
    'Compare two versions of text side by side and highlight what changed — free and instant.',
  longDescription:
    'Paste an original and a revised text to see exactly what changed. Text Diff Viewer highlights added lines in green and removed lines in red, and reports the number of insertions and deletions — handy for reviewing edits, drafts and copy updates without installing anything.',
  category: 'writing',
  keywords: ['text diff', 'compare text online', 'find differences in text', 'side by side compare', 'diff viewer'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Line diff', 'Add/remove highlight', 'Change count', 'Side by side'],
  relatedTools: ['text-cleaner', 'word-counter'],
};
