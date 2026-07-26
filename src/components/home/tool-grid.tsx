'use client';

import { useState } from 'react';
import { allTools } from '@/tools/registry';
import { CATEGORIES } from '@/tools/categories';
import { ToolCard } from './tool-card';
import { useI18n } from '@/i18n';
import type { ToolCategory } from '@/tools/types';

type TabKey = 'all' | ToolCategory;

export function ToolGrid() {
  const [active, setActive] = useState<TabKey>('all');
  const [visible, setVisible] = useState(24);
  const { t } = useI18n();

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: t('common.allTools', 'All Tools') },
    ...CATEGORIES.map((c) => ({ key: c.slug as TabKey, label: t(`categories.${c.slug}.short`, c.short) })),
  ];

  const filtered =
    active === 'all' ? allTools : allTools.filter((t) => t.category === active);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const selectTab = (key: TabKey) => {
    setActive(key);
    setVisible(24);
  };

  return (
    <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-20">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-slate-900">
        {t('common.allTools', 'All Tools')}
      </h2>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-1 rounded-xl bg-slate-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => selectTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === tab.key
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible(filtered.length)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand/30 hover:text-brand"
          >
            {t('common.showAll', `Show all ${filtered.length} tools`)}
          </button>
        </div>
      )}
    </section>
  );
}
