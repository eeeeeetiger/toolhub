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
};
