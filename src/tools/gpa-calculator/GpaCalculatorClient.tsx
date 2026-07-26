'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

const GRADES: { g: string; pts: number }[] = [
  { g: 'A', pts: 4 },
  { g: 'B', pts: 3 },
  { g: 'C', pts: 2 },
  { g: 'D', pts: 1 },
  { g: 'F', pts: 0 },
];

interface Row {
  grade: string;
  credits: string;
}

export default function GpaCalculatorClient() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Row[]>([
    { grade: 'A', credits: '3' },
    { grade: 'B', credits: '4' },
  ]);

  const { gpa, totalCredits } = useMemo(() => {
    let pts = 0;
    let creds = 0;
    for (const r of rows) {
      const c = parseFloat(r.credits);
      if (isNaN(c) || c <= 0) continue;
      const gp = GRADES.find((x) => x.g === r.grade)?.pts ?? 0;
      pts += gp * c;
      creds += c;
    }
    return { gpa: creds > 0 ? pts / creds : NaN, totalCredits: creds };
  }, [rows]);

  function update(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3">
            <select
              value={r.grade}
              onChange={(e) => update(i, { grade: e.target.value })}
              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand focus:outline-none"
            >
              {GRADES.map((g) => (
                <option key={g.g} value={g.g}>
                  {g.g}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              step="0.5"
              value={r.credits}
              placeholder="Credits"
              onChange={(e) => update(i, { credits: e.target.value })}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <button
              onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
              className="text-xs text-red-500 hover:underline"
            >
              {t('tools.gpa-calculator.ui.remove', 'Remove')}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setRows((prev) => [...prev, { grade: 'A', credits: '3' }])}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-brand/40"
      >
        + {t('tools.gpa-calculator.ui.add', 'Add course')}
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-brand/30 bg-brand/[0.06] p-4">
          <div className="text-xs text-slate-500">{t('tools.gpa-calculator.ui.gpa', 'GPA')}</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{isNaN(gpa) ? '—' : gpa.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">{t('tools.gpa-calculator.ui.credits', 'Total credits')}</div>
          <div className="mt-1 text-xl font-bold text-slate-900">{totalCredits.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
