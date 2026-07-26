import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'reading-time',
  name: 'Reading Time Estimator',
  description:
    'Estimate how long your text takes to read, with mixed Chinese & English counting — free and instant.',
  longDescription:
    'Paste any text to estimate reading time. Reading Time Estimator counts Chinese characters (≈300 / min) and English words (≈200 / min) separately, then combines them for a realistic total — perfect for bilingual blog posts, newsletters and docs where a single word-count rule gets it wrong.',
  category: 'writing',
  keywords: ['reading time calculator', 'read time estimate', 'chinese reading time', 'bilingual reading time', 'word count to minutes'],
  icon: 'Type',
  isClientOnly: true,
  features: ['Mixed CN/EN', 'Separate counts', 'Speech time', 'Minute estimate'],
  relatedTools: ['word-counter', 'readability-analyzer'],
};
