import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { getToolBySlug } from '@/tools/registry';
import { SITE_NAME, siteUrl } from '@/lib/site';
import Markdown from '@/components/blog/markdown';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = siteUrl(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Build "Related tools" from the inline /tools/ links in the article.
  const linked = Array.from(
    new Set(
      (post.content.match(/\/tools\/[a-z0-9-]+/g) ?? []).map((s) =>
        s.replace('/tools/', '')
      )
    )
  );
  const relatedTools = linked
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article>
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.category}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500">{post.excerpt}</p>
        </header>

        <Markdown content={post.content} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {relatedTools.length > 0 && (
        <section className="mt-10 rounded-xl border border-slate-100 bg-slate-50/60 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Try these tools
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {relatedTools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-brand hover:bg-brand/[0.03]"
                >
                  <span className="block text-sm font-medium text-slate-900">
                    {tool.name}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-slate-500">
                    {tool.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-sm">
        <Link href="/blog" className="text-brand hover:underline">
          ← Back to blog
        </Link>
      </p>
    </main>
  );
}
