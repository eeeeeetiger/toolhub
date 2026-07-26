'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  let count = (w.match(/[aeiouy]+/g) || []).length;
  if (w.endsWith('es') || w.endsWith('ed')) count -= 1;
  if (w.endsWith('e') && !w.endsWith('le')) count -= 1;
  if (count < 1) count = 1;
  return count;
}

function bandFor(score: number): { key: string; fallback: string; cls: string } {
  if (score >= 90) return { key: 'tools.readability-analyzer.ui.bandVeryEasy', fallback: 'Very Easy', cls: 'bg-emerald-100 text-emerald-700' };
  if (score >= 80) return { key: 'tools.readability-analyzer.ui.bandEasy', fallback: 'Easy', cls: 'bg-emerald-100 text-emerald-700' };
  if (score >= 70) return { key: 'tools.readability-analyzer.ui.bandFairlyEasy', fallback: 'Fairly Easy', cls: 'bg-lime-100 text-lime-700' };
  if (score >= 60) return { key: 'tools.readability-analyzer.ui.bandStandard', fallback: 'Standard', cls: 'bg-amber-100 text-amber-700' };
  if (score >= 50) return { key: 'tools.readability-analyzer.ui.bandFairlyHard', fallback: 'Fairly Hard', cls: 'bg-amber-100 text-amber-700' };
  if (score >= 30) return { key: 'tools.readability-analyzer.ui.bandHard', fallback: 'Hard', cls: 'bg-orange-100 text-orange-700' };
  return { key: 'tools.readability-analyzer.ui.bandVeryConfusing', fallback: 'Very Confusing', cls: 'bg-red-100 text-red-700' };
}

export default function ReadabilityAnalyzerClient() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const words = trimmed.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || [];
    const wordCount = words.length;
    const sentences = trimmed.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim()).length;
    const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

    if (wordCount === 0 || sentences === 0) return null;

    const avgSentence = wordCount / sentences;
    const avgSyllable = syllables / wordCount;

    // Flesch Reading Ease: 206.835 - 1.015*ASL - 84.6*ASW
    const ease = 206.835 - 1.015 * avgSentence - 84.6 * avgSyllable;
    const clampedEase = Math.max(0, Math.min(100, Math.round(ease * 10) / 10));

    // Flesch–Kincaid Grade Level
    const grade = 0.39 * avgSentence + 11.8 * avgSyllable - 15.59;
    const gradeRounded = Math.max(0, Math.round(grade * 10) / 10);

    const band = bandFor(clampedEase);
    return {
      wordCount,
      sentences,
      syllables,
      avgSentence: Math.round(avgSentence * 10) / 10,
      avgSyllable: Math.round(avgSyllable * 100) / 100,
      ease: clampedEase,
      grade: gradeRounded,
      band,
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tools.readability-analyzer.ui.placeholder', 'Paste English text to analyze…')}
        className="h-48 w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
      />

      {result ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  {t('tools.readability-analyzer.ui.flesch', 'Flesch Reading Ease')}
                </div>
                <div className="text-4xl font-bold text-slate-900">{result.ease}</div>
                <div className="text-xs text-slate-400">0–100 · {t('tools.readability-analyzer.ui.higherEasy', 'higher = easier')}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${result.band.cls}`}>
                {t(result.band.key, result.band.fallback)}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand" style={{ width: `${result.ease}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.grade}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.grade', 'Grade Level')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.avgSentence}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.avgSent', 'Avg words / sentence')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.avgSyllable}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.avgSyl', 'Avg syllables / word')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.wordCount}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.words', 'Words')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.sentences}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.sents', 'Sentences')}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xl font-semibold text-slate-900">{result.syllables}</div>
              <div className="text-xs text-slate-500">{t('tools.readability-analyzer.ui.syls', 'Syllables')}</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t('tools.readability-analyzer.ui.empty', 'Enter some English text to see its readability score.')}</p>
      )}
    </div>
  );
}
