'use client';

import * as React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/storefront/hero-section';
import { FlashSaleBanner } from '@/components/storefront/flash-sale-banner';
import { CategoryCard } from '@/components/storefront/category-card';
import { ProductCard } from '@/components/storefront/product-card';
import { BundlesSection } from '@/components/storefront/bundles-section';
import { TestimonialsSection } from '@/components/storefront/testimonials-section';
import { TrustBadges } from '@/components/storefront/trust-badges';
import { useCatalog } from '@/lib/store/catalog-context';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function HomePage() {
  const { categories, products, settings } = useCatalog();

  const trendingProducts = products.filter((p) => p.is_trending).slice(0, 8);
  const newDrops = products.slice(0, 8);

  const cleanWhatsapp = (settings?.whatsapp_number || '923370566870').replace(/[^0-9]/g, '');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.store_name || 'MW Trends',
    url: 'https://mw-trend.vercel.app',
    logo: 'https://mw-trend.vercel.app/brand/monogram.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${cleanWhatsapp}`,
      contactType: 'Customer Service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Flash Sale Banner (strictly visible only if created & active in Admin) */}
      <FlashSaleBanner />

      {/* 3. Main Catalog Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 py-12">
        {/* Categories Grid */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Browse Categories
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  Shop By Category
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}

        {/* Featured / Trending Products */}
        {trendingProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-gold text-gold" />
                  Popular Gifts
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  Trending Personalized Gifts
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                <span>See All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Complete Store Catalog Preview */}
        {newDrops.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Latest Releases
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  Latest Custom Catalog
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-gold hover:underline flex items-center gap-1"
              >
                <span>View Full Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newDrops.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* Active Combos & Bundles (hides completely if empty) */}
        <BundlesSection />

        {/* Verified Reviews (hides completely if empty) */}
        <TestimonialsSection />
      </div>

      {/* Trust Badges */}
      <TrustBadges />
    </>
  );
}
