import type { ToolConfig } from '../types';

export const config: ToolConfig = {
  slug: 'dns-lookup',
  name: 'DNS Lookup',
  description:
    'Query DNS records (A, AAAA, MX, TXT, CNAME, NS) for any domain using a public resolver.',
  longDescription:
    'DNS Lookup resolves a domain and returns its DNS records using Google’s public DNS resolver. Check A, AAAA, MX, TXT, CNAME and NS records to troubleshoot propagation, email delivery and subdomain configuration. The lookup runs from your browser — no server stores your queries.',
  category: 'seo',
  keywords: ['dns lookup', 'dns checker', 'dns records', 'check dns', 'mx record lookup'],
  icon: 'Search',
  isClientOnly: true,
  features: ['A / AAAA / MX / TXT', 'CNAME / NS', 'TTL display', 'Instant results'],
  relatedTools: ['meta-tag-generator', 'robots-txt-generator'],
};
