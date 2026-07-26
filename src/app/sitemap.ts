import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { allTools } from '@/tools/registry';
import { CATEGORIES } from '@/tools/categories';

const BASE = 'https://toolhub.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = allTools.map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
