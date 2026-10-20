import type { MetadataRoute } from 'next';
import { getSiteData } from '@/lib/data';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteData();
  const baseUrl = `https://${site.identity.domain}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
