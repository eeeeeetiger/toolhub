'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';
import type { ToolCategory } from '@/tools/types';
import { FileText, Code, Search, Image as ImageIcon, Type, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileText,
  Code,
  Search,
  Image: ImageIcon,
  Type,
};

export function CategoryCard({
  slug,
  label,
  description,
  icon,
}: {
  slug: ToolCategory | string;
  label: string;
  description: string;
  icon: string;
}) {
  const { t } = useI18n();
  const Icon = ICONS[icon] ?? Code;
  return (
    <Link
      href={`/categories/${slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/[0.04] hover:-translate-y-0.5"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand/[0.08] group-hover:text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand">
        {t(`categories.${slug}.label`, label)}
      </h3>
      <p className="text-xs leading-relaxed text-slate-500">
        {t(`categories.${slug}.description`, description)}
      </p>
    </Link>
  );
}

export function CategoryGrid({ categories }: { categories: { slug: ToolCategory; label: string; description: string; icon: string }[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard
            key={c.slug}
            slug={c.slug}
            label={c.label}
            description={c.description}
            icon={c.icon}
          />
        ))}
      </div>
    </section>
  );
}
