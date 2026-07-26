import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allTools, getToolBySlug } from '@/tools/registry';
import { generateToolMetadata } from '@/lib/seo';
import ToolPageClient from './ToolPageClient';

export function generateStaticParams() {
  return allTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateToolMetadata(tool);
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <ToolPageClient params={params} tool={tool} />;
}
