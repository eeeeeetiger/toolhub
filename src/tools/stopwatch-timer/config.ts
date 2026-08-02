import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'stopwatch-timer',
  name: 'Stopwatch & Timer',
  description:
    'A free online stopwatch with laps and a countdown timer with sound alert — no install needed.',
  longDescription:
    'A simple, accurate online stopwatch and countdown timer that runs right in your browser. Use the stopwatch to time activities and record lap splits, or set a countdown for studying, cooking, workouts and presentations with a clear sound and visual alert when time is up. Nothing to install and nothing to sign up for.',
  category: 'utility',
  keywords: ['online stopwatch', 'countdown timer', 'timer online', 'stopwatch with laps', 'pomodoro timer'],
  icon: 'Timer',
  isClientOnly: true,
  features: ['Stopwatch with laps', 'Countdown timer', 'Sound alert', 'Precise timing'],
  relatedTools: ['calculator', 'timestamp-converter'],

  howTo: [
    'Open Stopwatch & Timer in your browser.',
    'Add your input or file.',
    'Get the result instantly — processed locally, nothing is uploaded.',
  ],
  faqs: [
    { q: 'Is Stopwatch & Timer free?', a: 'Yes, Offline ToolHub tools are free and private.' },
    { q: 'Is my data uploaded?', a: 'No. Processing happens locally in your browser.' },
    { q: 'Do I need to sign up?', a: 'No account is needed.' },
    { q: 'Does it work offline?', a: 'Once loaded, Stopwatch & Timer runs entirely on your device.' },
  ],
};