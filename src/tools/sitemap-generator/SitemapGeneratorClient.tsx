'use client';

import { useMemo, useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function SitemapGeneratorClient() {
  const { t } = useI18n();
  const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
  const [copied, setCopied] = useState(false);

  const xml = useMemo(() => {
    const list = urls.split('\n').map((u) => u.trim()).filter((u) => /^https?:\/\//.test(u));
    if (!list.length) return '';
    const items = list.map((u) => `  <url>\n    <loc>${esc(u)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [urls]);

  const copy = async () => {
    if (!xml) return;
    const ok = await copyToClipboard(xml);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  const download = () => {
    if (!xml) return;
    const blob = new Blob([xml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">{t('tools.sitemap-generator.ui.onePerLine', 'One URL per line:')}</p>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="h-64 w-full resize-y rounded-lg border border-slate-200 p-3 font-mono text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </div>
      <div className="space-y-3">
        <pre className="h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{xml || t('tools.sitemap-generator.ui.empty', 'Enter valid URLs to generate…')}</pre>
        <div className="flex gap-2">
          <button onClick={copy} disabled={!xml} className="flex-1 rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-brand/30 hover:text-brand disabled:opacity-50">
            {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
          </button>
          <button onClick={download} disabled={!xml} className="flex-1 rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">
            {t('tools.sitemap-generator.ui.download', 'Download .xml')}
          </button>
        </div>
      </div>
    </div>
  );
}
