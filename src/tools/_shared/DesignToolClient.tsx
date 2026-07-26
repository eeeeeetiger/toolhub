'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { contrastRatio, gcd } from './tool-logic';

function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3 flex gap-2">
      <textarea readOnly value={text} className="h-28 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800" />
      <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="self-start rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function DesignToolClient() {
  const { t } = useI18n();
  const pathname = usePathname();
  const slug = (pathname || '').replace(/^\/tools\//, '').replace(/\/$/, '');

  const [gType, setGType] = useState<'linear' | 'radial'>('linear');
  const [gAngle, setGAngle] = useState(90);
  const [gC1, setGC1] = useState('#6366f1');
  const [gC2, setGC2] = useState('#ec4899');
  const [shX, setShX] = useState(4);
  const [shY, setShY] = useState(4);
  const [shBlur, setShBlur] = useState(12);
  const [shSpread, setShSpread] = useState(0);
  const [shColor, setShColor] = useState('#000000');
  const [shInset, setShInset] = useState(false);
  const [cA, setCA] = useState('#ffffff');
  const [cB, setCB] = useState('#2563eb');
  const [arW, setArW] = useState(16);
  const [arH, setArH] = useState(9);

  if (!['css-gradient-generator', 'box-shadow-generator', 'color-contrast-checker', 'aspect-ratio-calculator'].includes(slug)) {
    return <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Tool not found.</div>;
  }

  const inpCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800';

  if (slug === 'css-gradient-generator') {
    const css = gType === 'linear'
      ? `background: linear-gradient(${gAngle}deg, ${gC1}, ${gC2});`
      : `background: radial-gradient(circle, ${gC1}, ${gC2});`;
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex gap-3">
            <select className={inpCls} value={gType} onChange={(e) => setGType(e.target.value as 'linear' | 'radial')}>
              <option value="linear">Linear</option><option value="radial">Radial</option>
            </select>
            {gType === 'linear' && <input type="number" className={inpCls} value={gAngle} onChange={(e) => setGAngle(parseInt(e.target.value) || 0)} />}
          </div>
          <div className="flex gap-3">
            <input type="color" value={gC1} onChange={(e) => setGC1(e.target.value)} className="h-10 w-16 rounded border" />
            <input type="color" value={gC2} onChange={(e) => setGC2(e.target.value)} className="h-10 w-16 rounded border" />
          </div>
        </div>
        <div>
          <div className="h-40 rounded-lg border border-slate-200" style={{ background: gType === 'linear' ? `linear-gradient(${gAngle}deg, ${gC1}, ${gC2})` : `radial-gradient(circle, ${gC1}, ${gC2})` }} />
          <CopyBox text={css} />
        </div>
      </div>
    );
  }

  if (slug === 'box-shadow-generator') {
    const css = `box-shadow: ${shInset ? 'inset ' : ''}${shX}px ${shY}px ${shBlur}px ${shSpread}px ${shColor};`;
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {[['X', shX, setShX], ['Y', shY, setShY], ['Blur', shBlur, setShBlur], ['Spread', shSpread, setShSpread]].map(([n, v, setV]) => (
            <div key={n as string}><label className="mb-1 block text-sm text-slate-600">{n as string}</label><input type="number" className={inpCls} value={v as number} onChange={(e) => (setV as (x: number) => void)(parseInt(e.target.value) || 0)} /></div>
          ))}
          <div><label className="mb-1 block text-sm text-slate-600">Color</label><input type="color" value={shColor} onChange={(e) => setShColor(e.target.value)} className="h-10 w-full rounded border" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={shInset} onChange={(e) => setShInset(e.target.checked)} /> Inset</label>
        </div>
        <div>
          <div className="flex h-40 items-center justify-center rounded-lg border border-slate-200 bg-white">
            <div className="h-20 w-20 rounded-lg bg-brand" style={{ boxShadow: `${shInset ? 'inset ' : ''}${shX}px ${shY}px ${shBlur}px ${shSpread}px ${shColor}` }} />
          </div>
          <CopyBox text={css} />
        </div>
      </div>
    );
  }

  if (slug === 'color-contrast-checker') {
    const ratio = contrastRatio(cA, cB);
    const aa = ratio >= 4.5, aaa = ratio >= 7;
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div><label className="mb-1 block text-sm text-slate-600">Foreground</label><input type="color" value={cA} onChange={(e) => setCA(e.target.value)} className="h-10 w-24 rounded border" /></div>
          <div><label className="mb-1 block text-sm text-slate-600">Background</label><input type="color" value={cB} onChange={(e) => setCB(e.target.value)} className="h-10 w-24 rounded border" /></div>
        </div>
        <div className="rounded-lg p-6 text-center" style={{ background: cB, color: cA }}>
          <span className="text-2xl font-bold">The quick brown fox</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-slate-200 p-3"><div className="text-2xl font-bold">{ratio.toFixed(2)}</div><div className="text-xs text-slate-500">Contrast</div></div>
          <div className={`rounded-lg border p-3 ${aa ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}><div className="text-sm font-semibold">{aa ? 'Pass AA' : 'Fail AA'}</div><div className="text-xs text-slate-500">≥ 4.5</div></div>
          <div className={`rounded-lg border p-3 ${aaa ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}><div className="text-sm font-semibold">{aaa ? 'Pass AAA' : 'Fail AAA'}</div><div className="text-xs text-slate-500">≥ 7.0</div></div>
        </div>
      </div>
    );
  }

  // aspect-ratio-calculator
  const g = gcd(arW, arH) || 1;
  const ratio = `${arW / g}:${arH / g}`;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-sm text-slate-600">Width</label><input type="number" className={inpCls} value={arW} onChange={(e) => setArW(parseInt(e.target.value) || 1)} /></div>
        <div><label className="mb-1 block text-sm text-slate-600">Height</label><input type="number" className={inpCls} value={arH} onChange={(e) => setArH(parseInt(e.target.value) || 1)} /></div>
      </div>
      <div className="rounded-lg border border-brand/30 bg-brand/[0.06] p-6 text-center">
        <div className="text-xs text-slate-500">Simplified ratio</div>
        <div className="text-4xl font-bold text-slate-900">{ratio}</div>
        <div className="mt-1 text-xs text-slate-500">Decimal: {(arW / arH).toFixed(3)}</div>
      </div>
      <div className="text-sm text-slate-600">
        At width 1920 → height <b>{Math.round(1920 * arH / arW)}</b>; at height 1080 → width <b>{Math.round(1080 * arW / arH)}</b>.
      </div>
    </div>
  );
}
