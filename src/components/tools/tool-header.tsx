'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';
import type { ToolConfig, ToolCategory } from '@/tools/types';

const CATEGORY_LABELS: Record<ToolCategory, string> = {
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

export function ToolHeader({ tool }: { tool: ToolConfig }) {
  const { t } = useI18n();
  const categoryLabel = CATEGORY_LABELS[tool.category];

  return (
    <div className="mb-8">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-600">
        <Link href="/" className="transition-colors hover:text-brand">
          {t('common.home', 'Home')}
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${tool.category}`}
          className="transition-colors hover:text-brand"
        >
          {t(`categories.${tool.category}.short`, categoryLabel)}
        </Link>
        <span>/</span>
        <span className="font-medium text-slate-700">
          {t(`tools.${tool.slug}.name`, tool.name)}
        </span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
        {t(`tools.${tool.slug}.name`, tool.name)}
      </h1>

      {tool.longDescription && (
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          {t(`tools.${tool.slug}.longDescription`, tool.longDescription)}
        </p>
      )}

      {tool.features.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tool.features.map((feature, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500"
            >
              {t(`tools.${tool.slug}.features.${i}`, feature)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
