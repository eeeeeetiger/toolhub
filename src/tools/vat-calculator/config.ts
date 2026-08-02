import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'vat-calculator',
  name: 'VAT Calculator',
  description: 'Add or reverse VAT on any net amount for invoicing and accounting.',
  longDescription: 'A simple VAT calculator for Europe and beyond. Enter a net amount and VAT rate to get the VAT and gross total instantly.',
  category: 'calculators',
  keywords: ['vat calculator', 'calculate vat', 'vat inclusive', 'net to gross'],
  icon: 'Calculator',
  isClientOnly: true,
  features: ['VAT amount', 'Gross total', 'Any rate'],
  relatedTools: [],
  howTo: ['Enter your values in the fields above.', 'The result updates instantly.', 'Adjust inputs to compare scenarios.'],
  addedAt: '2026-07-21',

  faqs: [
    { q: 'Is VAT Calculator free?', a: 'Yes, every calculator on Offline ToolHub is free.' },
    { q: 'Is my data stored?', a: 'No. Calculations happen instantly in your browser and nothing is saved.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
    { q: 'Does it work on mobile?', a: 'Yes. VAT Calculator runs in any modern browser, including phones.' },
  ],
};