import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'gpa-calculator',
  name: 'GPA Calculator',
  description: 'Calculate your Grade Point Average from course grades and credits — instantly.',
  longDescription:
    'Work out your GPA the easy way. The GPA Calculator takes each course grade (A–F) and its credits, then computes your weighted Grade Point Average. Add or remove courses as needed — everything runs locally in your browser.',
  category: 'calculators',
  keywords: ['gpa calculator', 'grade point average', 'calculate gpa', 'college gpa'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Weighted GPA', 'Course list', 'Instant'],
  relatedTools: ['percentage-calculator'],

  howTo: [
    'Open GPA Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is GPA Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. GPA Calculator runs in any modern browser, including phones.' },
  ],
};