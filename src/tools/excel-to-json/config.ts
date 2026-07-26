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
};
