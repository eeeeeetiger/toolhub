import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'chmod-calculator',
  name: 'Chmod Calculator',
  description: 'Convert between numeric and symbolic file permissions.',
  longDescription: 'Type 755 or rwxr-xr-x and see the other form plus the owner/group/other breakdown. Pure client-side.',
  category: 'developer',
  keywords: ['chmod calculator', 'file permissions', 'rwx converter', 'chmod 755'],
  icon: 'ShieldCheck',
  isClientOnly: true,
  features: ['Octal ⇄ symbolic', 'Per-class view', 'Instant'],
  relatedTools: ['cron-parser', 'sql-formatter', 'jwt-generator'],
};
