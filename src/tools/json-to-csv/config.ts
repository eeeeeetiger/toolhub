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
};
