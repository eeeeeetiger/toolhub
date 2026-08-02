import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'bmi-calculator',
  name: 'BMI Calculator',
  description: 'Calculate your Body Mass Index and weight category — instantly, in your browser.',
  longDescription:
    'Find out your BMI in seconds. Enter your height and weight and the BMI Calculator shows your Body Mass Index and whether you are underweight, normal, overweight or obese. No signup, no upload — the math runs locally on your device.',
  category: 'calculators',
  keywords: ['bmi calculator', 'calculate bmi', 'body mass index', 'bmi calculator kg cm'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['BMI score', 'Weight category', 'Instant'],
  relatedTools: ['age-calculator', 'percentage-calculator'],

  howTo: [
    'Open BMI Calculator in your browser.',
    'Enter your numbers in the input fields.',
    'See the result update instantly — everything is computed locally on your device.',
  ],
  faqs: [
    { q: 'Is BMI Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. BMI Calculator runs in any modern browser, including phones.' },
  ],
};