'use client';

import { useMemo } from 'react';
import { useI18n } from '@/i18n';
import { allTools } from '@/tools/registry';
import { POPULAR_TOOL_SLUGS } from '@/tools/popular-tools';
import { getToolBySlug } from '@/tools/registry';
import { ToolCard } from '@/components/tools/tool-card';
import { Sparkles } from 'lucide-react';

export function NewTools() {
  const { t } = useI18n();

  const tools = useMemo(() => {
    const dated = allTools
      .filter((x) => x.addedAt)
      .sort((a, b) => (a.addedAt! < b.addedAt! ? 1 : -1))
      .slice(0, 8);
    if (dated.length >= 4) return dated;
    // 兜底：尚未配置上线日期时，用热门工具填充，保证板块不空
    return POPULAR_TOOL_SLUGS.map(getToolBySlug).filter(Boolean).slice(0, 8);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/[0.08] text-brand">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {t('common.newAndUpdated', 'New & Updated')}
          </h2>
          <p className="text-xs text-slate-400">
            {t('common.newAndUpdatedDesc', 'Freshly added tools worth a try.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool!.slug} tool={tool!} />
        ))}
      </div>
    </section>
  );
}
