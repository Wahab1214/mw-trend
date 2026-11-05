import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mwtrends.pk';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/order-success/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
