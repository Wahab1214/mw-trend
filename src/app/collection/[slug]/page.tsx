'use client';

import * as React from 'react';
import { notFound, useParams } from 'next/navigation';
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/storefront/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkles } from 'lucide-react';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const collection = INITIAL_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const [allProducts, setAllProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_products');
      if (stored) {
        setAllProducts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const products = allProducts.filter(
    (p) => p.collection_id === collection.id || p.is_trending
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-8">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: collection.name },
        ]}
      />

      {/* Collection Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171207] via-[#241A0B] to-[#171207] border border-gold/40 p-8 sm:p-12 shadow-xl">
        <div className="max-w-xl space-y-3 relative z-10">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Special Occasion Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-white">
            {collection.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Curated Gift Selections ({products.length})
          </span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No items in this collection"
            description="Explore our complete catalog for alternative gift ideas."
            actionLabel="Explore Shop"
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
