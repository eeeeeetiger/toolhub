import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'excel-to-csv',
  name: 'Excel to CSV',
  description: 'Convert an .xlsx sheet into CSV.',
  longDescription: 'Open an Excel file and export its first sheet as CSV text you can copy or download. Processed locally with SheetJS.',
  category: 'documents',
  keywords: ['excel to csv', 'xlsx to csv', 'convert excel to csv', 'xlsx csv'],
  icon: 'FileSpreadsheet',
  isClientOnly: true,
  features: ['First sheet', 'Local', 'SheetJS'],
  relatedTools: ['csv-to-excel', 'excel-to-json', 'json-to-csv'],

  howTo: [
    'Open Excel to CSV in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is Excel to CSV free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};