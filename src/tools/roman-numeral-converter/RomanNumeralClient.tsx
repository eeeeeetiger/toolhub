'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function toRoman(n: number): string | null {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let s = '';
  for (const [v, sym] of ROMAN) {
    while (n >= v) {
      s += sym;
      n -= v;
    }
  }
  return s;
}

function fromRoman(s: string): number | null {
  const str = s.trim().toUpperCase();
  if (!str) return null;
  let total = 0;
  let prev = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    const v = ROMAN.find(([, sym]) => sym === str[i])?.[0];
    if (v === undefined) return null;
    if (v < prev) total -= v;
    else {
      total += v;
      prev = v;
    }
  }
  return total;
}

export default function RomanNumeralClient() {
  const { t } = useI18n();
  const [arabic, setArabic] = useState('2026');
  const [roman, setRoman] = useState('MMXXVI');
  const [base, setBase] = useState('255');
  const [baseFrom, setBaseFrom] = useState<number>(10);
  const [baseTo, setBaseTo] = useState<number>(16);

  const romanResult = useMemo(() => toRoman(parseInt(arabic, 10)), [arabic]);
  const arabicResult = useMemo(() => fromRoman(roman), [roman]);
  const baseResult = useMemo(() => {
    const n = parseInt(base, baseFrom);
    if (isNaN(n)) return null;
    return n.toString(baseTo).toUpperCase();
  }, [base, baseFrom, baseTo]);

  const bases = [2, 8, 10, 16];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.roman-numeral-converter.ui.toRoman', 'Number → Roman')}</h3>
        <input
          type="number"
          value={arabic}
          min={1}
          max={3999}
          onChange={(e) => setArabic(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <div className="mt-3 rounded-lg bg-brand/[0.06] p-4 text-center text-2xl font-bold tracking-widest text-slate-900">
          {romanResult ?? '—'}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.roman-numeral-converter.ui.toNum', 'Roman → Number')}</h3>
        <input
          type="text"
          value={roman}
          onChange={(e) => setRoman(e.target.value)}
          placeholder="e.g. MMXXVI"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm uppercase text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <div className="mt-3 rounded-lg bg-brand/[0.06] p-4 text-center text-2xl font-bold text-slate-900">
          {arabicResult ?? '—'}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.roman-numeral-converter.ui.base', 'Base converter')}</h3>
        <input
          type="text"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
        />
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <select
            value={baseFrom}
            onChange={(e) => setBaseFrom(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
          >
            {bases.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <span className="pb-2 text-slate-400">→</span>
          <select
            value={baseTo}
            onChange={(e) => setBaseTo(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
          >
            {bases.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="mt-3 rounded-lg bg-brand/[0.06] p-4 text-center text-2xl font-bold text-slate-900">
          {baseResult ?? '—'}
        </div>
      </div>
    </div>
  );
}
