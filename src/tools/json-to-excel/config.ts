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
};
