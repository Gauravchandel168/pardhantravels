import type { MetadataRoute } from 'next';
import { getRoutes } from '@/lib/data';
import { SITE_URL } from '@/lib/util';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/tours`, changeFrequency: 'weekly', priority: 0.8 },
    ...routes.map((r: any) => ({ url: `${SITE_URL}/routes/${r.slug}`, changeFrequency: 'monthly' as const, priority: 0.9 })),
  ];
}
