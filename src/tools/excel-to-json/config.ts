import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'excel-to-json',
  name: 'Excel to JSON',
  description: 'Convert an .xlsx sheet into JSON.',
  longDescription: 'Read an Excel workbook and turn its first sheet into a JSON array of row objects. Runs locally with SheetJS.',
  category: 'documents',
  keywords: ['excel to json', 'xlsx to json', 'convert excel to json', 'xlsx json'],
  icon: 'FileJson',
  isClientOnly: true,
  features: ['First sheet', 'Local', 'SheetJS'],
  relatedTools: ['json-to-excel', 'excel-to-csv', 'csv-to-json'],

  howTo: [
    'Open Excel to JSON in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Excel to JSON free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};