'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';
import type { ToolConfig, ToolCategory } from '@/tools/types';
import { FileText, Code, Search, Image as ImageIcon, Type, Wrench, Video, Music, Calculator, Ruler, Palette, type LucideIcon } from 'lucide-react';

const ICONS: Record<ToolCategory, LucideIcon> = {
  writing: Type,
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

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const { t } = useI18n();
  const Icon = ICONS[tool.category];
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/[0.04] hover:-translate-y-0.5"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand/[0.08] group-hover:text-brand">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand">
        {t(`tools.${tool.slug}.name`, tool.name)}
      </h3>

      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
        {t(`tools.${tool.slug}.description`, tool.description)}
      </p>

      {tool.features && tool.features.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {tool.features.slice(0, 3).map((feat, i) => (
            <span
              key={i}
              className="inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[10px] text-slate-400"
            >
              {t(`tools.${tool.slug}.features.${i}`, feat)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
