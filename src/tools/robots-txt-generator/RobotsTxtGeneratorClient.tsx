'use client';

import { useMemo, useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

const BOTS = [
  { id: 'googlebot', label: 'Googlebot' },
  { id: 'bingbot', label: 'Bingbot' },
  { id: 'slurp', label: 'Yahoo Slurp' },
  { id: 'duckduckbot', label: 'DuckDuckBot' },
];

export default function RobotsTxtGeneratorClient() {
  const { t } = useI18n();
  const [allowed, setAllowed] = useState<string[]>(['googlebot', 'bingbot']);
  const [disallow, setDisallow] = useState('/admin\n/private');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines: string[] = [];
    BOTS.forEach((b) => {
      lines.push(`User-agent: ${b.id}`);
      lines.push(allowed.includes(b.id) ? 'Allow: /' : 'Disallow: /');
    });
    if (disallow.trim()) {
      lines.push('');
      lines.push('User-agent: *');
      disallow.split('\n').map((p) => p.trim()).filter(Boolean).forEach((p) => lines.push(`Disallow: ${p}`));
    }
    if (sitemap.trim()) {
      lines.push('');
      lines.push(`Sitemap: ${sitemap.trim()}`);
    }
    return lines.join('\n');
  }, [allowed, disallow, sitemap]);

  const toggle = (id: string) =>
    setAllowed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const copy = async () => {
    const ok = await copyToClipboard(output);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('tools.robots-txt-generator.ui.allowBots', 'Allow these bots')}</h3>
          <div className="space-y-1.5">
            {BOTS.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={allowed.includes(b.id)} onChange={() => toggle(b.id)} />
                {b.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('tools.robots-txt-generator.ui.disallowPaths', 'Disallow paths (one per line)')}</h3>
          <textarea value={disallow} onChange={(e) => setDisallow(e.target.value)} className="h-24 w-full resize-y rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand" />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">{t('tools.robots-txt-generator.ui.sitemapUrl', 'Sitemap URL')}</h3>
          <input value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand" />
        </div>
      </div>

      <div className="space-y-3">
        <pre className="h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{output}</pre>
        <button onClick={copy} className="w-full rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark">
          {copied ? t('common.copied', 'Copied!') : t('tools.robots-txt-generator.ui.copy', 'Copy robots.txt')}
        </button>
      </div>
    </div>
  );
}
