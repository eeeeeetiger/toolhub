'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

type Row = { type: 'equal' | 'add' | 'remove'; text: string };

function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length;
  const m = b.length;
  // LCS DP table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const rows: Row[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'equal', text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: 'remove', text: a[i] });
      i++;
    } else {
      rows.push({ type: 'add', text: b[j] });
      j++;
    }
  }
  while (i < n) rows.push({ type: 'remove', text: a[i++] });
  while (j < m) rows.push({ type: 'add', text: b[j++] });
  return rows;
}

export default function DiffViewerClient() {
  const { t } = useI18n();
  const [original, setOriginal] = useState('');
  const [revised, setRevised] = useState('');

  const { rows, added, removed } = useMemo(() => {
    const a = original.split('\n');
    const b = revised.split('\n');
    const r = diffLines(a, b);
    let add = 0;
    let rem = 0;
    r.forEach((row) => {
      if (row.type === 'add') add++;
      else if (row.type === 'remove') rem++;
    });
    return { rows: r, added: add, removed: rem };
  }, [original, revised]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">{t('tools.diff-viewer.ui.original', 'Original')}</div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={t('tools.diff-viewer.ui.originalPh', 'Paste the original text…')}
            className="h-44 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-slate-500">{t('tools.diff-viewer.ui.revised', 'Revised')}</div>
          <textarea
            value={revised}
            onChange={(e) => setRevised(e.target.value)}
            placeholder={t('tools.diff-viewer.ui.revisedPh', 'Paste the revised text…')}
            className="h-44 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div className="flex gap-3 text-xs">
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
          +{added} {t('tools.diff-viewer.ui.added', 'added')}
        </span>
        <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
          -{removed} {t('tools.diff-viewer.ui.removed', 'removed')}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="max-h-80 overflow-auto font-mono text-xs">
          {rows.length === 0 ? (
            <div className="p-4 text-slate-400">{t('tools.diff-viewer.ui.empty', 'Enter text on both sides to compare.')}</div>
          ) : (
            rows.map((row, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap border-b border-slate-100 px-3 py-1 ${
                  row.type === 'add'
                    ? 'bg-emerald-50 text-emerald-800'
                    : row.type === 'remove'
                      ? 'bg-red-50 text-red-800'
                      : 'text-slate-600'
                }`}
              >
                <span className="mr-2 select-none opacity-60">
                  {row.type === 'add' ? '+' : row.type === 'remove' ? '-' : ' '}
                </span>
                {row.text || ' '}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
