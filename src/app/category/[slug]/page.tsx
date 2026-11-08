'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/storefront/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkles } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const [allProducts, setAllProducts] = React.useState<any[]>(INITIAL_PRODUCTS);

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

  const products = allProducts.filter((p) => {
    const pCatId = (p.category_id || '').toLowerCase();
    const pCatName = (p.category_name || '').toLowerCase();
    const targetId = (category.id || '').toLowerCase();
    const targetName = (category.name || '').toLowerCase();
    const targetSlug = (category.slug || '').toLowerCase();

    return (
      pCatId === targetId ||
      pCatId === targetSlug ||
      pCatName === targetName ||
      pCatName.includes(targetName) ||
      targetName.includes(pCatName)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-8">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: category.name },
        ]}
      />

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#121212] via-[#1E1E1E] to-[#121212] border border-gold/30 p-8 sm:p-12 shadow-lg">
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Studio Category
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-white">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Available Designs ({products.length})
          </span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products currently in this category"
            description="Our studio is currently adding new personalized drops to this category. Check back soon!"
            actionLabel="Browse All Shop"
            onAction={() => window.location.href = '/shop'}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
