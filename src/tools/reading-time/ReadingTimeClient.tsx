'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

const CN_PER_MIN = 300; // 中文阅读速度：字/分钟
const EN_PER_MIN = 200; // 英文阅读速度：词/分钟

function formatDuration(totalSeconds: number, unitSec: string, unitMin: string): string {
  if (totalSeconds < 60) return `${Math.max(1, Math.round(totalSeconds))} ${unitSec}`;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return s > 0 ? `${m} ${unitMin} ${s} ${unitSec}` : `${m} ${unitMin}`;
}

export default function ReadingTimeClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    // 中文：连续 CJK 字符数
    const cnChars = (trimmed.match(/[一-鿿㐀-䶿]/g) || []).length;
    // 英文单词：拉丁字母数字序列
    const enWords = (trimmed.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;

    const cnSeconds = (cnChars / CN_PER_MIN) * 60;
    const enSeconds = (enWords / EN_PER_MIN) * 60;
    const totalSeconds = cnSeconds + enSeconds;
    // 朗读时长：约 1.4 倍阅读（中文朗读约 200 字/分，英文约 130 词/分）
    const speechSeconds = (cnChars / 200) * 60 + (enWords / 130) * 60;

    const unitSec = t('tools.reading-time.ui.unitSec', 'sec');
    const unitMin = t('tools.reading-time.ui.unitMin', 'min');

    return {
      cnChars,
      enWords,
      totalSeconds,
      speechSeconds,
      formatted: formatDuration(totalSeconds, unitSec, unitMin),
      speechFormatted: formatDuration(speechSeconds, unitSec, unitMin),
    };
  }, [text, t]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.reading-time.ui.placeholder', 'Paste text (Chinese, English or mixed)…')}
        className="h-48 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      {stats ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-xs uppercase tracking-wide text-slate-400">{t('tools.reading-time.ui.readingTime', 'Estimated Reading Time')}</div>
            <div className="text-4xl font-bold text-slate-900">{stats.formatted}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{stats.cnChars}</div>
              <div className="text-xs text-slate-500">{t('tools.reading-time.ui.cn', 'Chinese chars')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{stats.enWords}</div>
              <div className="text-xs text-slate-500">{t('tools.reading-time.ui.en', 'English words')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{stats.speechFormatted}</div>
              <div className="text-xs text-slate-500">{t('tools.reading-time.ui.speech', 'Speech time')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{Math.ceil(stats.totalSeconds)}s</div>
              <div className="text-xs text-slate-500">{t('tools.reading-time.ui.totalSec', 'Total seconds')}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {t('tools.reading-time.ui.note', 'Chinese ≈ 300 chars/min, English ≈ 200 words/min. Speech time is a slower estimate for read-aloud.')}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t('tools.reading-time.ui.empty', 'Enter text to estimate reading time.')}</p>
      )}
    </div>
  );
}
