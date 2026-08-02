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

  howTo: [
    'Open DNS Lookup in your browser.',
    'Enter the URL or content you want to analyze.',
    'Review the result — processed locally, nothing is sent to a server.',
  ],
  faqs: [
    { q: 'Is DNS Lookup free?', a: 'Yes, and it runs entirely in your browser.' },
    { q: 'Are my inputs uploaded?', a: 'No. Your inputs are processed locally and never leave your device.' },
    { q: 'Do I need an account?', a: 'No account or signup is required.' },
    { q: 'Does it work for any website?', a: 'Yes. Just enter the URL or content you want to analyze.' },
  ],
};