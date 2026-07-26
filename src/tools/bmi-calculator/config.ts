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
};
