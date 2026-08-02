import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags: string[];
  category: string;
  updated?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string; // markdown body
}

function readPostFile(slug: string): BlogPost | null {
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath)
    ? mdPath
    : fs.existsSync(mdxPath)
      ? mdxPath
      : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: String(data.category ?? "Guides"),
    updated: data.updated ? String(data.updated) : undefined,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.(md|mdx)$/i.test(f))
    .map((f) => f.replace(/\.(md|mdx)$/i, ""));
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const post = readPostFile(slug);
      if (!post) return null;
      const { content, ...meta } = post;
      void content;
      return meta;
    })
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPostFile(slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) p.tags.forEach((t) => tags.add(t));
  return Array.from(tags).sort();
}
