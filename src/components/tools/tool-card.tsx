'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import type { ToolConfig, ToolCategory } from '@/tools/types';
import {
  FileText,
  Code,
  Search,
  Image as ImageIcon,
  Type,
  Wrench,
  Video,
  Music,
  Calculator,
  Ruler,
  Palette,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { getPinnedSlugs, togglePinnedSlug } from '@/lib/search';

const ICONS: Record<ToolCategory, LucideIcon> = {
  developer: Code,
  seo: Search,
  image: ImageIcon,
  pdf: FileText,
  utility: Wrench,
  video: Video,
  audio: Music,
  calculators: Calculator,
  converters: Ruler,
  design: Palette,
  text: Type,
  documents: FileText,
};

export function ToolCard({
  tool,
  showPin = false,
  compact = false,
}: {
  tool: ToolConfig;
  showPin?: boolean;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const Icon = ICONS[tool.category];
  const [pinned, setPinned] = useState(false);

  // Read pinned state after mount (avoids SSR/localStorage hydration mismatch).
  useEffect(() => {
    setPinned(getPinnedSlugs().includes(tool.slug));
  }, [tool.slug]);

  const onPin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = togglePinnedSlug(tool.slug);
    setPinned(next.includes(tool.slug));
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/[0.04] hover:-translate-y-0.5 sm:p-5"
    >
      {showPin && (
        <button
          type="button"
          onClick={onPin}
          aria-label={pinned ? t('common.pinned', 'Pinned') : t('common.pin', 'Pin to Quick Tools')}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            pinned
              ? 'text-amber-500 hover:bg-amber-50'
              : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
          }`}
        >
          <Star className="h-4 w-4" fill={pinned ? 'currentColor' : 'none'} />
        </button>
      )}

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand/[0.08] group-hover:text-brand">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mb-1 pr-6 text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand">
        {t(`tools.${tool.slug}.name`, tool.name)}
      </h3>

      {!compact && (
        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {t(`tools.${tool.slug}.description`, tool.description)}
        </p>
      )}

      {tool.features && tool.features.length > 0 && !compact && (
        <div className="mt-auto flex flex-wrap gap-1">
          {tool.features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600"
            >
              {t(`tools.${tool.slug}.features.${i}`, feat)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
