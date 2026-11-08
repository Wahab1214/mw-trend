'use client';

import * as React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/storefront/hero-section';
import { FlashSaleBanner } from '@/components/storefront/flash-sale-banner';
import { ProductCard } from '@/components/storefront/product-card';
import { CategoryCard } from '@/components/storefront/category-card';
import { OccasionCarousel } from '@/components/storefront/occasion-carousel';
import { BundlesSection } from '@/components/storefront/bundles-section';
import { GiftFinderTeaser } from '@/components/storefront/gift-finder-teaser';
import { TestimonialsSection } from '@/components/storefront/testimonials-section';
import { TrustBadges } from '@/components/storefront/trust-badges';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types';
import { ArrowRight, Flame, Sparkles, Instagram, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [allProducts, setAllProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          for (const initP of INITIAL_PRODUCTS) {
            if (!merged.some((m) => m.id === initP.id || m.slug === initP.slug)) {
              merged.push(initP);
            }
          }
          setAllProducts(merged);
          return;
        }
      }
    } catch {
      // ignore
    }
    setAllProducts(INITIAL_PRODUCTS);
  }, []);

  const trendingProducts = allProducts.filter((p) => p.is_trending).slice(0, 4);
  const newDrops = allProducts.filter((p) => p.is_new).slice(0, 4);

  // Structured Data (JSON-LD)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MW Trends',
    url: 'https://mwtrends.pk',
    logo: 'https://mwtrends.pk/brand/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-300-0000000',
      contactType: 'customer service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
    sameAs: [
      'https://instagram.com/mwtrends.pk',
      'https://facebook.com/mwtrendspk',
      'https://tiktok.com/@mwtrends.pk',
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MW Trends',
    url: 'https://mwtrends.pk',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mwtrends.pk/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Flash Sale Countdown Banner (only shows if active) */}
      <FlashSaleBanner />

      {/* 3. Main Container for Core Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">
        {/* Category Visual Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Explore Studio Craft
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                Featured Categories
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INITIAL_CATEGORIES.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* If products exist, show Trending Favorites */}
        {trendingProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-gold text-gold" />
                  Customer Favorites
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  Trending Now in Pakistan
                </h2>
              </div>
              <Link href="/shop?filter=trending" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
                <span>See More</span>
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

        {/* Occasion Collections Carousel */}
        <OccasionCarousel />

        {/* If products exist, show New Drops */}
        {newDrops.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Fresh from Lahore Studio
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  New Drops &amp; Recent Releases
                </h2>
              </div>
              <Link href="/shop?filter=new" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
                <span>View All New</span>
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

        {/* Studio Concierge Banner when catalog is freshly cleared or waiting for owner uploads */}
        {allProducts.length === 0 && (
          <div className="rounded-3xl bg-surface border border-gold/30 p-8 sm:p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
                Atelier Custom Orders Open
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We craft bespoke monogram ceramic mugs, laser-engraved executive pens, heavyweight streetwear apparel, and gold-foil keepsake cards. Connect directly with our studio to place your personalized custom order today!
              </p>
            </div>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="gold" size="md" className="gap-2 font-bold text-xs uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp VIP Concierge</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Interactive Gift Finder Teaser */}
        <GiftFinderTeaser />

        {/* Curated Combos & Bundles (hides if empty) */}
        <BundlesSection />

        {/* Customer Reviews & Testimonials (hides if empty) */}
        <TestimonialsSection />

        {/* Instagram & WhatsApp Community CTA */}
        <section className="rounded-3xl bg-surface border border-border p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">
              Join Our Community
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
              Follow Us @mwtrends.pk
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Tag us in your unboxing videos and stories for a chance to be featured and win a complimentary luxury monogram gift card!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://instagram.com/mwtrends.pk"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="md" className="gap-2">
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>Instagram Feed</span>
              </Button>
            </a>

            <Link
              href="/contact"
            >
              <Button variant="gold" size="md" className="gap-2 font-bold">
                <Phone className="w-4 h-4" />
                <span>Contact VIP Concierge</span>
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Trust Badges */}
      <TrustBadges />
    </>
  );
}
