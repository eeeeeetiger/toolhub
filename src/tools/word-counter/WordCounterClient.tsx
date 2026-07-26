'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';
import { getKeywordDensity, getWordStats } from '../_shared/tool-logic';

export default function WordCounterClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const stats = useMemo(() => getWordStats(text), [text]);

  const density = useMemo(() => getKeywordDensity(text), [text]);

  const cards = [
    { label: t('tools.word-counter.ui.words', 'Words'), value: stats.words },
    { label: t('tools.word-counter.ui.characters', 'Characters'), value: stats.chars },
    { label: t('tools.word-counter.ui.charsNoSpaces', 'Chars (no spaces)'), value: stats.charsNoSpaces },
    { label: t('tools.word-counter.ui.sentences', 'Sentences'), value: stats.sentences },
    { label: t('tools.word-counter.ui.lines', 'Lines'), value: stats.lines },
    { label: t('tools.word-counter.ui.paragraphs', 'Paragraphs'), value: stats.paragraphs },
    { label: t('tools.word-counter.ui.readingTime', 'Reading time'), value: `${stats.readingTime} ${t('tools.word-counter.ui.unitMin', 'min')}` },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.word-counter.ui.placeholder', 'Type or paste your text here…')}
        className="h-56 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg bg-slate-50 p-3">
            <div className="text-xl font-semibold text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500">{c.label}</div>
          </div>
        ))}
      </div>

      {density.length > 0 && (
        <div className="rounded-lg border border-slate-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">{t('tools.word-counter.ui.topKeywords', 'Top Keywords')}</h3>
          <div className="space-y-2">
            {density.map((d) => (
              <div key={d.word} className="flex items-center gap-3">
                <span className="w-28 truncate text-xs text-slate-600">{d.word}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-12 text-right text-xs text-slate-500">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
