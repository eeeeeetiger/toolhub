import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'timestamp-converter',
  name: 'Unix Timestamp Converter',
  description:
    'Convert Unix timestamps to human-readable dates and back — supports seconds and milliseconds, local and UTC.',
  longDescription:
    'Instantly convert between Unix epoch timestamps and readable dates. Paste a timestamp in seconds or milliseconds to see the local time and UTC, or pick a date and time to get its epoch value. A live clock shows the current timestamp so you always have a reference. Perfect for developers, log analysis and API work.',
  category: 'utility',
  keywords: ['unix timestamp converter', 'epoch converter', 'timestamp to date', 'date to timestamp', 'epoch time'],
  icon: 'Clock',
  isClientOnly: true,
  features: ['Seconds & milliseconds', 'Local & UTC', 'Live current timestamp', 'Two-way conversion'],
  relatedTools: ['calculator', 'unit-converter'],

  howTo: [
    'Open Unix Timestamp Converter in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Unix Timestamp Converter free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Unix Timestamp Converter runs entirely on your device.' },
  ],
};