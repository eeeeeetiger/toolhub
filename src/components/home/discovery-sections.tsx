'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { getToolBySlug } from '@/tools/registry';
import { POPULAR_TOOL_SLUGS, HIDDEN_GEM_SLUGS } from '@/tools/popular-tools';
import {
  getRecentSlugs,
  getPinnedSlugs,
  pickHiddenGems,
  usePersonalization,
} from '@/lib/search';
import { ToolCard } from '@/components/tools/tool-card';
import { Star, Clock, Sparkles, Shuffle, ArrowRight } from 'lucide-react';

function Section({
  title,
  desc,
  icon,
  action,
  children,
}: {
  title: string;
  desc?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/[0.08] text-brand">
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
            {desc && <p className="text-xs text-slate-400">{desc}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PopularSection() {
  const { t } = useI18n();
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([]);
  usePersonalization();

  // Load pinned slugs after mount (localStorage only available on client).
  useEffect(() => {
    setPinnedSlugs(getPinnedSlugs());
  }, []);

  const tools = useMemo(() => {
    const seeds = POPULAR_TOOL_SLUGS.map(getToolBySlug).filter(Boolean) as NonNullable<
      ReturnType<typeof getToolBySlug>
    >[];
    const pinnedTools = pinnedSlugs
      .map(getToolBySlug)
      .filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];
    // Pinned tools first (in pin order), then the curated popular seeds, deduped.
    const seen = new Set<string>();
    const merged = [...pinnedTools, ...seeds].filter((tool) => {
      if (seen.has(tool.slug)) return false;
      seen.add(tool.slug);
      return true;
    });
    return merged.slice(0, 8);
  }, [pinnedSlugs]);

  return (
    <Section
      title={t('common.popularTools', 'Popular Tools')}
      desc={t('common.quickToolsDesc', 'Popular picks for everyday tasks. Tap ★ to pin your own.')}
      icon={<Star className="h-5 w-5" />}
      action={
        <Link
          href="/#tools"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
        >
          {t('common.viewAll', 'View all')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} showPin compact />
        ))}
      </div>
    </Section>
  );
}

export function RecentSection() {
  const { t } = useI18n();
  const [slugs, setSlugs] = useState<string[]>([]);
  usePersonalization();

  useEffect(() => {
    setSlugs(getRecentSlugs());
  }, []);

  // 新用户没有任何历史记录时不渲染（避免首屏出现空框）
  if (slugs.length === 0) return null;

  const tools = slugs.map(getToolBySlug).filter(Boolean) as NonNullable<
    ReturnType<typeof getToolBySlug>
  >[];

  const clear = () => {
    try {
      window.localStorage.removeItem('toolhub-recent');
    } catch {
      /* ignore */
    }
    setSlugs([]);
  };

  return (
    <Section
      title={t('common.recent', 'Recent')}
      icon={<Clock className="h-5 w-5" />}
      action={
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          {t('common.clearRecent', 'Clear')}
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} compact />
        ))}
      </div>
    </Section>
  );
}

export function DiscoverSection() {
  const { t } = useI18n();
  const [gems, setGems] = useState<ReturnType<typeof getToolBySlug>[]>([]);

  const shuffle = () => {
    const pinned = new Set(getPinnedSlugs());
    const popular = new Set(POPULAR_TOOL_SLUGS);
    const exclude = new Set([...pinned, ...popular]);
    // Prefer curated hidden gems, fill the rest from the long tail.
    const curated = HIDDEN_GEM_SLUGS.map(getToolBySlug).filter(Boolean) as NonNullable<
      ReturnType<typeof getToolBySlug>
    >[];
    let pool = curated;
    if (pool.length < 12) {
      pool = [...curated, ...pickHiddenGems(12, new Set(curated.map((x) => x!.slug)))];
    }
    const shuffled = pickHiddenGems(12, exclude);
    setGems(shuffled);
  };

  useEffect(() => {
    shuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section
      title={t('common.discover', 'Discover')}
      desc={t('common.discoverDesc', 'Handy tools you might not have found yet.')}
      icon={<Sparkles className="h-5 w-5" />}
      action={
        <button
          type="button"
          onClick={shuffle}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand/30 hover:bg-brand/[0.04] hover:text-brand"
        >
          <Shuffle className="h-3.5 w-3.5" />
          {t('common.shuffle', 'Shuffle')}
        </button>
      }
    >
      <p className="mb-3 text-sm font-medium text-slate-500">
        {t('common.whatDoYouWant', 'What do you want to do?')}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {(gems as NonNullable<ReturnType<typeof getToolBySlug>>[]).map(
          (tool) =>
            tool && (
              <ToolCard key={tool.slug} tool={tool} showPin compact />
            ),
        )}
      </div>
    </Section>
  );
}
