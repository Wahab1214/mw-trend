import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mwtrends.pk';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gift-finder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: 'always', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/shipping-returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = INITIAL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = INITIAL_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collection/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.created_at),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...collectionPages, ...productPages];
}
