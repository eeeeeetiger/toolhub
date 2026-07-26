'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useI18n } from '@/i18n';

// Google truncation limits (approx, in CSS pixels)
const TITLE_MAX_PX = 580;
const DESC_MAX_PX = 920;

function useCanvas() {
  const ref = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const c = document.createElement('canvas');
    ref.current = c.getContext('2d');
  }, []);
  return ref;
}

/** Measure text pixel width with a given font; falls back to char estimate. */
function measure(ctx: CanvasRenderingContext2D | null, text: string, font: string): number {
  if (!ctx) return text.length * 8;
  ctx.font = font;
  return ctx.measureText(text).width;
}

/** Truncate text to fit within maxPx, appending an ellipsis like Google does. */
function truncateToPx(ctx: CanvasRenderingContext2D | null, text: string, font: string, maxPx: number): { text: string; truncated: boolean } {
  if (measure(ctx, text, font) <= maxPx) return { text, truncated: false };
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(ctx, text.slice(0, mid) + '…', font) <= maxPx) lo = mid;
    else hi = mid - 1;
  }
  return { text: text.slice(0, lo).trimEnd() + '…', truncated: true };
}

export default function SerpPreviewClient() {
  const { t } = useI18n();
  const ctxRef = useCanvas();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const titleFont = device === 'desktop' ? '20px Arial, sans-serif' : '18px Arial, sans-serif';
  const descFont = '14px Arial, sans-serif';
  const titleMax = device === 'desktop' ? TITLE_MAX_PX : 490;
  const descMax = device === 'desktop' ? DESC_MAX_PX : 830;

  const titleInfo = useMemo(
    () => truncateToPx(ctxRef.current, title || t('tools.serp-preview.ui.sampleTitle', 'Your Page Title Goes Here — Brand Name'), titleFont, titleMax),
    [title, titleFont, titleMax, ctxRef, t]
  );
  const descInfo = useMemo(
    () => truncateToPx(ctxRef.current, description || t('tools.serp-preview.ui.sampleDesc', 'Your meta description appears here. Aim for a compelling summary that encourages users to click through from the search results.'), descFont, descMax),
    [description, descFont, descMax, ctxRef, t]
  );

  const titlePx = Math.round(measure(ctxRef.current, title, titleFont));
  const descPx = Math.round(measure(ctxRef.current, description, descFont));

  const displayUrl = useMemo(() => {
    const u = url.trim() || 'https://example.com/page';
    try {
      const parsed = new URL(u.startsWith('http') ? u : `https://${u}`);
      const parts = parsed.pathname.split('/').filter(Boolean);
      return { domain: parsed.hostname.replace(/^www\./, ''), crumbs: parts };
    } catch {
      return { domain: 'example.com', crumbs: [] };
    }
  }, [url]);

  const field = 'w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand';

  const Meter = ({ label, px, max, chars }: { label: string; px: number; max: number; chars: number }) => {
    const over = px > max;
    const pct = Math.min(100, (px / max) * 100);
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">{label}</span>
          <span className={over ? 'font-medium text-red-600' : 'text-slate-500'}>
            {chars} {t('tools.serp-preview.ui.chars', 'chars')} · {px}px / {max}px
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${over ? 'bg-red-500' : 'bg-brand'}`} style={{ width: `${pct}%` }} />
        </div>
        {over && (
          <div className="text-xs text-red-600">
            {t('tools.serp-preview.ui.overLimit', 'Too long — Google will cut this off with an ellipsis.')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: inputs */}
      <div className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('tools.serp-preview.ui.titlePlaceholder', 'Page title (title tag)')} className={field} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('tools.serp-preview.ui.descPlaceholder', 'Meta description')} className={`${field} h-24 resize-y`} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className={field} />

        <div className="flex gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${device === 'desktop' ? 'border-brand bg-brand text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {t('tools.serp-preview.ui.desktop', 'Desktop')}
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex-1 rounded-lg border px-3 py-1.5 text-sm font-medium ${device === 'mobile' ? 'border-brand bg-brand text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {t('tools.serp-preview.ui.mobile', 'Mobile')}
          </button>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          <Meter label={t('tools.serp-preview.ui.titleWidth', 'Title width')} px={titlePx} max={titleMax} chars={title.length} />
          <Meter label={t('tools.serp-preview.ui.descWidth', 'Description width')} px={descPx} max={descMax} chars={description.length} />
        </div>
      </div>

      {/* Right: preview */}
      <div className="space-y-3">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
            {t('common.preview', 'Preview')} · {device === 'desktop' ? t('tools.serp-preview.ui.desktop', 'Desktop') : t('tools.serp-preview.ui.mobile', 'Mobile')}
          </div>
          <div className={`p-4 ${device === 'mobile' ? 'max-w-sm' : ''}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500">
                {displayUrl.domain.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="text-xs text-slate-800">{displayUrl.domain}</div>
                <div className="text-[11px] text-slate-500">
                  {displayUrl.domain}
                  {displayUrl.crumbs.length > 0 && ` › ${displayUrl.crumbs.join(' › ')}`}
                </div>
              </div>
            </div>
            <div className="cursor-pointer text-[20px] leading-tight text-[#1a0dab] hover:underline">
              {titleInfo.text}
            </div>
            <div className="mt-1 text-[14px] leading-snug text-[#4d5156]">
              {descInfo.text}
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {t('tools.serp-preview.ui.note', 'Widths are approximate — Google renders snippets differently over time. Titles truncate around 580px (desktop), descriptions around 920px.')}
        </p>
      </div>
    </div>
  );
}
