import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'xml-to-json',
  name: 'XML to JSON',
  description: 'Convert XML into a JSON object.',
  longDescription: 'Parse an XML document into a nested JSON structure, preserving attributes and child elements. Handy for APIs and config files. Runs locally.',
  category: 'documents',
  keywords: ['xml to json', 'convert xml', 'xml converter', 'xml json'],
  icon: 'Braces',
  isClientOnly: true,
  features: ['Nested JSON', 'Attributes kept', 'Local'],
  relatedTools: ['csv-to-json', 'json-to-csv', 'excel-to-json'],
};
