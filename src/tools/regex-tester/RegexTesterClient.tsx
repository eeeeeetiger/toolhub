'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';
import { runRegex } from '../_shared/tool-logic';

export default function RegexTesterClient() {
  const { t } = useI18n();
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact: alice@example.com or bob@test.org');

  const result = useMemo(() => runRegex(pattern, flags, text), [pattern, flags, text]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <span className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-slate-400">/</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t('tools.regex-tester.ui.pattern', 'pattern')}
          className="flex-1 border border-slate-200 p-2 font-mono text-sm outline-none focus:border-brand"
        />
        <span className="flex items-center border border-l-0 border-r-0 border-slate-200 bg-slate-50 px-2 text-slate-400">/</span>
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="g"
          className="w-16 border border-l-0 border-slate-200 p-2 font-mono text-sm outline-none focus:border-brand"
        />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.regex-tester.ui.testString', 'Test string…')}
        className="h-40 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      {result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{result.error}</div>
      )}

      <div className="text-sm text-slate-600">
        {result.ok && <span className="font-medium text-slate-900">{result.matches.length}</span>} {t('tools.regex-tester.ui.matches', 'matches')}
      </div>

      {result.matches.length > 0 && (
        <div className="space-y-2">
          {result.matches.map((mt, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="font-mono text-sm text-brand">{mt.value}</div>
              {mt.groups.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {mt.groups.map((g, gi) => (
                    <span key={gi} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{t('tools.regex-tester.ui.group', 'group')} {gi + 1}: {g}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
