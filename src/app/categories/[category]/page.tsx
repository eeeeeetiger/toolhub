import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORIES, getCategory } from '@/tools/categories';
import { allTools } from '@/tools/registry';
import { ToolCard } from '@/components/home/tool-card';
import { AdSlot } from '@/components/layout/ad-slot';
import { CategoryIntro } from '@/components/tools/category-intro';
import type { ToolCategory } from '@/tools/types';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategory(category);
  if (!meta) return {};
  const url = `https://toolhub.dev/categories/${meta.slug}`;
  return {
    title: `${meta.label} — Free Online Utilities`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: { title: meta.label, description: meta.description, url, type: 'website' },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = getCategory(category);
  if (!meta) notFound();

  const tools = allTools.filter((t) => t.category === (meta.slug as ToolCategory));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <CategoryIntro slug={meta.slug} />

      <AdSlot slot="header" format="horizontal" className="my-8" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
