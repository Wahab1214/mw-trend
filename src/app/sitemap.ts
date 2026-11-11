import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mock-data';
import { getReadableSupabaseClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mw-trend.vercel.app';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/track-order`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/shipping-returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  let categorySlugs: { slug: string; updated_at?: string }[] = INITIAL_CATEGORIES.map((c: any) => ({
    slug: c.slug,
    updated_at: c.updated_at,
  }));
  let productSlugs: { slug: string; updated_at?: string }[] = INITIAL_PRODUCTS.map((p: any) => ({
    slug: p.slug,
    updated_at: p.updated_at,
  }));

  try {
    const supabase = getReadableSupabaseClient();
    if (supabase) {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('slug, updated_at').eq('is_active', true),
        supabase.from('products').select('slug, updated_at').eq('is_published', true),
      ]);
      if (cats && cats.length > 0) categorySlugs = cats;
      if (prods && prods.length > 0) productSlugs = prods;
    }
  } catch {
    // Fallback to initial slugs
  }

  const categoryPages: MetadataRoute.Sitemap = categorySlugs.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(cat.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const productPages: MetadataRoute.Sitemap = productSlugs.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
