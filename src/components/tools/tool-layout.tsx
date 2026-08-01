'use client';

import type { ToolConfig } from '@/tools/types';
import { ToolHeader } from './tool-header';
import { ToolContent } from './tool-content';
import { AdSlot } from '@/components/layout/ad-slot';
import { useI18n } from '@/i18n';
import { getToolBySlug, getToolsByCategory } from '@/tools/registry';
import Link from 'next/link';

interface ToolLayoutProps {
  tool: ToolConfig;
  schema: object;
  children: React.ReactNode;
}

export function ToolLayout({ tool, schema, children }: ToolLayoutProps) {
  const { t } = useI18n();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <ToolHeader tool={tool} />

        <AdSlot slot="header" format="horizontal" className="mb-8" />

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          {children}
        </div>

        <div className="mb-8 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3">
          <svg
            className="h-4 w-4 shrink-0 text-emerald-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 1a9 9 0 100 18 9 9 0 000-18zm3.707 7.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-emerald-700">
            {t('common.privacyNote', 'Your data is processed entirely in your browser. Nothing is uploaded to any server.')}
          </p>
        </div>

        <AdSlot slot="infeed" format="rectangle" className="mb-8" />

        <ToolContent tool={tool} />

        <AdSlot slot="footer" format="horizontal" />

        <RelatedTools tool={tool} />
      </div>
    </>
  );
}

function RelatedTools({ tool }: { tool: ToolConfig }) {
  const { t } = useI18n();
  // Use explicit relatedTools, otherwise fall back to other tools in the same category.
  const explicit = (tool.relatedTools ?? []).filter((s) => s !== tool.slug);
  const fallback = getToolsByCategory(tool.category)
    .map((x) => x.slug)
    .filter((s) => s !== tool.slug);
  const slugs = [...new Set([...explicit, ...fallback])].slice(0, 8);

  if (slugs.length === 0) return null;

  return (
    <div className="mb-2">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        {t('common.relatedTools', 'Related Tools')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {slugs.map((slug) => {
          const rel = getToolBySlug(slug);
          return (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-brand/30 hover:bg-brand/[0.02] hover:text-brand"
            >
              {rel ? t(`tools.${slug}.name`, rel.name) : slug}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
