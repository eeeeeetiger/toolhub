import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'csv-to-json',
  name: 'CSV to JSON',
  description: 'Convert a CSV table into a JSON array.',
  longDescription: 'Turn spreadsheet rows into a clean JSON array of objects using the header row as keys. Runs locally in your browser.',
  category: 'documents',
  keywords: ['csv to json', 'convert csv', 'csv converter', 'csv to javascript'],
  icon: 'FileJson',
  isClientOnly: true,
  features: ['Header → keys', 'Local', 'Copy / download'],
  relatedTools: ['json-to-csv', 'csv-to-excel', 'excel-to-json'],

  howTo: [
    'Open CSV to JSON in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is CSV to JSON free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};