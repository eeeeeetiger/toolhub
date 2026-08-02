import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'csv-to-excel',
  name: 'CSV to Excel',
  description: 'Convert CSV into a downloadable .xlsx file.',
  longDescription: 'Turn a CSV table into a real Excel workbook you can open and edit. Built locally with SheetJS — no upload.',
  category: 'documents',
  keywords: ['csv to excel', 'csv to xlsx', 'convert csv to excel', 'csv excel'],
  icon: 'FileSpreadsheet',
  isClientOnly: true,
  features: ['.xlsx output', 'Local', 'SheetJS'],
  relatedTools: ['excel-to-csv', 'json-to-excel', 'csv-to-json'],

  howTo: [
    'Open CSV to Excel in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is CSV to Excel free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};