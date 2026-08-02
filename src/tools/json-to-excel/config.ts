import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'json-to-excel',
  name: 'JSON to Excel',
  description: 'Convert a JSON array into an Excel .xlsx file.',
  longDescription: 'Export structured JSON straight into a spreadsheet. Columns are taken from the object keys. Runs locally with SheetJS.',
  category: 'documents',
  keywords: ['json to excel', 'json to xlsx', 'export json to excel', 'json spreadsheet'],
  icon: 'Sheet',
  isClientOnly: true,
  features: ['.xlsx output', 'Local', 'SheetJS'],
  relatedTools: ['excel-to-json', 'csv-to-excel', 'json-to-csv'],

  howTo: [
    'Open JSON to Excel in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is JSON to Excel free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};