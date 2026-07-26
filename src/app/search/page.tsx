'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { searchTools } from '@/lib/search';
import { ToolCard } from '@/components/tools/tool-card';
import { SearchBox } from '@/components/layout/search-box';
import { AdSlot } from '@/components/layout/ad-slot';

function SearchResults() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const hits = q.trim() ? searchTools(q, 60) : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <SearchBox
          variant="full"
          autoFocus={false}
          onNavigate={() => {
            /* router push handled inside SearchBox */
          }}
        />
      </div>

      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t('common.resultsFor', 'Results for')}{' '}
          <span className="text-brand">“{q}”</span>
        </h1>
        <span className="text-sm text-slate-400">
          {hits.length} {hits.length === 1 ? 'tool' : 'tools'}
        </span>
      </div>

      {hits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
          <p className="text-slate-500">{t('common.noResults', `No tools match “${q}”.`).replace('{q}', q)}</p>
          <Link
            href="/#tools"
            className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            {t('common.tryBrowse', 'Try browsing all tools')} →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map((h) => (
            <ToolCard key={h.tool.slug} tool={h.tool} />
          ))}
        </div>
      )}

      <AdSlot slot="infeed" format="rectangle" className="mt-8" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">…</div>}>
      <SearchResults />
    </Suspense>
  );
}
