'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';

type Style = {
  key: string;
  tKey: string;
  label: string;
  cap?: number;
  low?: number;
  dig?: number;
  capExc?: Record<string, number>;
  lowExc?: Record<string, number>;
  digFn?: (d: string) => number | null;
};

const A = 'A'.charCodeAt(0);
const a = 'a'.charCodeAt(0);

const STYLES: Style[] = [
  { key: 'bold', tKey: 'styleBold', label: 'Bold', cap: 0x1d400, low: 0x1d41a, dig: 0x1d7ce },
  {
    key: 'italic',
    tKey: 'styleItalic',
    label: 'Italic',
    cap: 0x1d434,
    low: 0x1d44e,
    lowExc: { h: 0x210e },
  },
  {
    key: 'bolditalic',
    tKey: 'styleBoldItalic',
    label: 'Bold Italic',
    cap: 0x1d468,
    low: 0x1d482,
    lowExc: { h: 0x210e },
  },
  { key: 'sans', tKey: 'styleSans', label: 'Sans-serif', cap: 0x1d5a0, low: 0x1d5ba, dig: 0x1d7ec },
  { key: 'mono', tKey: 'styleMono', label: 'Monospace', cap: 0x1d670, low: 0x1d68a, dig: 0x1d7f6 },
  { key: 'full', tKey: 'styleFull', label: 'Full-width', cap: 0xff21, low: 0xff41, dig: 0xff10 },
  { key: 'circle', tKey: 'styleCircle', label: 'Circled', cap: 0x24b6, low: 0x24d0, digFn: (d) => (d === '0' ? 0x24ea : 0x2460 + (+d - 1)) },
  { key: 'square', tKey: 'styleSquare', label: 'Squared', cap: 0x1f130, low: 0x1f170 },
  {
    key: 'ds',
    tKey: 'styleDoubleStruck',
    label: 'Double-struck',
    cap: 0x1d538,
    low: 0x1d552,
    dig: 0x1d7d8,
    capExc: { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 },
  },
  {
    key: 'fraktur',
    tKey: 'styleFraktur',
    label: 'Fraktur',
    cap: 0x1d504,
    low: 0x1d51e,
    capExc: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  },
  {
    key: 'bfraktur',
    tKey: 'styleBoldFraktur',
    label: 'Bold Fraktur',
    cap: 0x1d56c,
    low: 0x1d586,
    capExc: { C: 0x212d, H: 0x210c, I: 0x2111, R: 0x211c, Z: 0x2128 },
  },
  {
    key: 'script',
    tKey: 'styleScript',
    label: 'Script',
    cap: 0x1d49c,
    low: 0x1d4b6,
    capExc: { B: 0x212c, E: 0x2130, F: 0x2131, H: 0x210b, I: 0x2110, L: 0x2112, M: 0x2133 },
    lowExc: { e: 0x212f, g: 0x210a, o: 0x2134 },
  },
];

function convert(style: Style, text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= A && code <= A + 25) {
      const c = ch.toUpperCase();
      const exc = style.capExc?.[c];
      out += String.fromCodePoint(exc ?? (style.cap ? style.cap + (code - A) : code));
    } else if (code >= a && code <= a + 25) {
      const c = ch.toLowerCase();
      const exc = style.lowExc?.[c];
      out += String.fromCodePoint(exc ?? (style.low ? style.low + (code - a) : code));
    } else if (style.digFn && /[0-9]/.test(ch)) {
      const p = style.digFn(ch);
      out += p ? String.fromCodePoint(p) : ch;
    } else if (style.dig && /[0-9]/.test(ch)) {
      out += String.fromCodePoint(style.dig + (+ch));
    } else {
      out += ch;
    }
  }
  return out;
}

export default function FancyTextGeneratorClient() {
  const { t } = useI18n();
  const [text, setText] = useState('Fancy Text');
  const [copied, setCopied] = useState('');

  const copy = (s: string, key: string) => {
    navigator.clipboard?.writeText(s);
    setCopied(key);
    setTimeout(() => setCopied(''), 1200);
  };

  return (
    <div className="space-y-5">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input"
        placeholder={t('tools.fancy-text-generator.ui.placeholder', 'Type something…')}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {STYLES.map((s) => {
          const out = convert(s, text);
          const shown = out.length > 28 ? out.slice(0, 28) + '…' : out;
          return (
            <button
              key={s.key}
              onClick={() => copy(out, s.key)}
              className="flex flex-col items-start rounded-xl border border-brand/15 bg-white px-4 py-3 text-left hover:bg-brand/5 dark:bg-slate-900"
              title={t('common.copy', 'Copy')}
            >
              <span className="text-xs text-slate-400">{t(`tools.fancy-text-generator.ui.${s.tKey}`, s.label)}</span>
              <span className="truncate text-lg">{shown || '—'}</span>
            </button>
          );
        })}
      </div>
      {copied && (
        <p className="text-sm text-brand">{t('tools.fancy-text-generator.ui.copied', 'Copied to clipboard!')}</p>
      )}
    </div>
  );
}
