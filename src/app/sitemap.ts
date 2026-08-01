import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { allTools } from '@/tools/registry';
import { CATEGORIES } from '@/tools/categories';
import { SITE_URL, siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: siteUrl('/about'), changeFrequency: 'monthly', priority: 0.4 },
    { url: siteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: siteUrl('/terms'), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: siteUrl(`/categories/${c.slug}`),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = allTools.map((t) => {
    const lastModified = t.addedAt
      ? new Date(`${t.addedAt}T00:00:00.000Z`)
      : undefined;

    return {
      url: siteUrl(`/tools/${t.slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
