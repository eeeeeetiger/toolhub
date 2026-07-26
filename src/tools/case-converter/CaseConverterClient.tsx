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
  const [copied, setCopied] = useState(false);

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
    const ok = await copyToClipboard(convert(mode, text));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.case-converter.ui.placeholder', 'Type or paste text to convert…')}
        className="h-40 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => handleCopy(m.key)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand/30 hover:bg-brand/[0.04] hover:text-brand"
          >
            {copied ? t('common.copied', 'Copied!') : t(m.labelKey, m.fallback)}
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-600">
        {text ? convert('lower', text).slice(0, 200) : t('tools.case-converter.ui.preview', 'Preview appears here…')}
      </div>
    </div>
  );
}
