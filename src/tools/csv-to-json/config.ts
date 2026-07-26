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
};
