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
};
