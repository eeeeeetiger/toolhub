import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'regex-tester',
  name: 'Regex Tester',
  description:
    'Test regular expressions against any text with live match highlighting and capture groups.',
  longDescription:
    'Regex Tester lets you build and debug regular expressions in real time. Enter a pattern and flags, paste your test string, and see every match highlighted with its capture groups. Great for validating input formats, extracting data and learning regex without leaving your browser.',
  category: 'developer',
  keywords: ['regex tester', 'regular expression tester', 'regex online', 'regex debugger', 'test regex'],
  icon: 'Code',
  isClientOnly: true,
  features: ['Live highlighting', 'Flags support', 'Capture groups', 'Match count'],
  relatedTools: ['json-formatter', 'base64'],
};
