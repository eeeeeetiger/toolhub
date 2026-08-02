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

  howTo: [
    'Open XML to JSON in your browser.',
    'Add your document or data file.',
    'Convert or process it locally on your device.',
    'Download the output — your file never leaves your computer.',
  ],
  faqs: [
    { q: 'Is XML to JSON free?', a: 'Yes, all document tools are free to use.' },
    { q: 'Are my documents uploaded?', a: 'No. Documents are processed locally in your browser.' },
    { q: 'What formats are supported?', a: 'Depends on the tool — common office, CSV, JSON and XML formats.' },
    { q: 'Do I need an account?', a: 'No signup required.' },
  ],
};