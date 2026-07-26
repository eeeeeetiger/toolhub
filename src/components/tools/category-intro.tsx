'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';
import type { ToolCategory } from '@/tools/types';

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  writing: 'Writing Tools',
  developer: 'Developer Tools',
  seo: 'SEO Tools',
  image: 'Image Tools',
  pdf: 'PDF Tools',
  utility: 'Everyday Tools',
  video: 'Video Tools',
  audio: 'Audio Tools',
  calculators: 'Calculators',
  converters: 'Unit Converters',
  design: 'Design Tools',
  text: 'Text Tools',
  documents: 'Document Tools',
};

export function CategoryIntro({ slug }: { slug: ToolCategory }) {
  const { t } = useI18n();
  const label = CATEGORY_LABELS[slug];
  return (
    <>
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
        <a href="/" className="transition-colors hover:text-brand">
          {t('common.home', 'Home')}
        </a>
        <span>/</span>
        <span className="font-medium text-slate-700">
          {t(`categories.${slug}.label`, label)}
        </span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {t(`categories.${slug}.label`, label)}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
        {t(`categories.${slug}.intro`, '')}
      </p>
    </>
  );
}
