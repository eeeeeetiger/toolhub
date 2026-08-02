import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'json-to-csv',
  name: 'JSON to CSV',
  description: 'Convert a JSON array into a CSV table.',
  longDescription: 'Flatten an array of objects into a CSV file with headers from the object keys. Perfect before opening data in Excel. Runs locally.',
  category: 'documents',
  keywords: ['json to csv', 'convert json', 'json to excel', 'json converter'],
  icon: 'Table',
  isClientOnly: true,
  features: ['Objects → rows', 'Local', 'Copy / download'],
  relatedTools: ['csv-to-json', 'json-to-excel', 'excel-to-csv'],

  howTo: [
    'Open JSON to CSV in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is JSON to CSV free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};