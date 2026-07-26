'use client';

import { useMemo, useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';

export default function MetaTagGeneratorClient() {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [twitter, setTwitter] = useState(true);
  const [copied, setCopied] = useState(false);

  const tags = useMemo(() => {
    if (!title && !description) return '';
    const lines: (string | false)[] = [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      url && `<link rel="canonical" href="${url}" />`,
      url && `<meta property="og:type" content="website" />`,
      url && `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      image && `<meta property="og:image" content="${image}" />`,
      twitter && `<meta name="twitter:card" content="summary_large_image" />`,
      twitter && `<meta name="twitter:title" content="${title}" />`,
      twitter && `<meta name="twitter:description" content="${description}" />`,
      twitter && image && `<meta name="twitter:image" content="${image}" />`,
    ];
    return lines.filter(Boolean).join('\n');
  }, [title, description, url, image, twitter]);

  const copy = async () => {
    if (!tags) return;
    const ok = await copyToClipboard(tags);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  const field = 'w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand';

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('tools.meta-tag-generator.ui.pageTitle', 'Page title')} className={field} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('tools.meta-tag-generator.ui.pageDescription', 'Page description')} className={`${field} h-24 resize-y`} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className={field} />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" className={field} />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={twitter} onChange={(e) => setTwitter(e.target.checked)} /> {t('tools.meta-tag-generator.ui.twitterTags', 'Include Twitter Card tags')}
        </label>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">{t('common.preview', 'Preview')}</div>
          <div className="p-4">
            <div className="text-xs text-slate-400">{url || 'example.com'}</div>
            <div className="font-semibold text-slate-900">{title || t('tools.meta-tag-generator.ui.yourTitle', 'Your page title')}</div>
            <div className="text-sm text-slate-500">{description || t('tools.meta-tag-generator.ui.yourDescription', 'Your page description will appear here.')}</div>
            {image && <div className="mt-3 h-24 w-full rounded bg-slate-100" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
          </div>
        </div>
        <pre className="max-h-48 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{tags || t('tools.meta-tag-generator.ui.fillFields', 'Fill in the fields to generate tags…')}</pre>
        <button onClick={copy} disabled={!tags} className="w-full rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50">
          {copied ? t('common.copied', 'Copied!') : t('tools.meta-tag-generator.ui.copyHtml', 'Copy HTML')}
        </button>
      </div>
    </div>
  );
}
