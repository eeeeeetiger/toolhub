import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'scientific-calculator',
  name: 'Scientific Calculator',
  description: 'Evaluate math expressions with + − × ÷ and powers — right in your browser.',
  longDescription:
    'A clean, private scientific calculator that lives in your browser. Type an expression using addition, subtraction, multiplication, division and exponents (e.g. 2+3*4^2) and get the result instantly. No install, no upload.',
  category: 'calculators',
  keywords: ['scientific calculator', 'online calculator', 'math calculator', 'expression calculator'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['Expression eval', 'Powers', 'No install'],
  relatedTools: ['percentage-calculator'],
};
