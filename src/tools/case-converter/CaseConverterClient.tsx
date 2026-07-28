'use client';

import { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';
import { useI18n } from '@/i18n';
import { toCamel, toSentenceCase, toSnake, toTitleCase } from '../_shared/tool-logic';

type Mode = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake';

const MODES: { key: Mode; labelKey: string; fallback: string }[] = [
  { key: 'upper', labelKey: 'tools.case-converter.ui.upper', fallback: 'UPPERCASE' },
  { key: 'lower', labelKey: 'tools.case-converter.ui.lower', fallback: 'lowercase' },
  { key: 'title', labelKey: 'tools.case-converter.ui.title', fallback: 'Title Case' },
  { key: 'sentence', labelKey: 'tools.case-converter.ui.sentence', fallback: 'Sentence case' },
  { key: 'camel', labelKey: 'tools.case-converter.ui.camel', fallback: 'camelCase' },
  { key: 'snake', labelKey: 'tools.case-converter.ui.snake', fallback: 'snake_case' },
];

export default function CaseConverterClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [copiedKey, setCopiedKey] = useState<Mode | null>(null);

  const convert = (mode: Mode, input: string): string => {
    switch (mode) {
      case 'upper': return input.toUpperCase();
      case 'lower': return input.toLowerCase();
      case 'title': return toTitleCase(input);
      case 'sentence': return toSentenceCase(input);
      case 'camel': return toCamel(input);
      case 'snake': return toSnake(input);
    }
  };

  const handleCopy = async (mode: Mode) => {
    if (!text) return;
    const ok = await copyToClipboard(convert(mode, text));
    if (ok) {
      setCopiedKey(mode);
      setTimeout(() => setCopiedKey((cur) => (cur === mode ? null : cur)), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.case-converter.ui.placeholder', 'Type or paste text to convert…')}
        className="h-40 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('tools.case-converter.ui.results', 'Live results')}
      </p>
      <div className="space-y-2">
        {MODES.map((m) => (
          <div
            key={m.key}
            role="button"
            tabIndex={0}
            onClick={() => handleCopy(m.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCopy(m.key);
              }
            }}
            className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:border-brand/40 hover:bg-brand/[0.04] focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {t(m.labelKey, m.fallback)}
              </span>
              <span className="text-xs font-medium text-brand">
                {copiedKey === m.key ? t('common.copied', 'Copied!') : t('tools.case-converter.ui.clickCopy', 'Click to copy')}
              </span>
            </div>
            <div className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-sm text-slate-700">
              {text ? convert(m.key, text) : t('tools.case-converter.ui.preview', 'Preview appears here…')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
