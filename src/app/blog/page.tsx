import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { SITE_NAME, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: `Blog — Guides & Tutorials`,
  description:
    'Step-by-step guides for converting, compressing, and editing files — all privately, in your browser. No uploads, no accounts.',
  alternates: { canonical: siteUrl('/blog') },
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description:
      'Step-by-step guides for converting, compressing, and editing files — all privately, in your browser.',
    url: siteUrl('/blog'),
    type: 'website',
  },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Blog</h1>
        <p className="text-sm text-slate-400">
          Practical guides for everyday file tasks — done privately in your browser.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {posts.map((post) => (
            <li key={post.slug} className="py-6">
              <article>
                <div className="mb-1 flex items-center gap-3 text-xs text-slate-400">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
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
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm">
        <Link href="/" className="text-brand hover:underline">
          ← Back to all tools
        </Link>
      </p>
    </main>
  );
}
