'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/storefront/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { useCatalog } from '@/lib/store/catalog-context';
import { Sparkles } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '').toLowerCase();
  const { categories, products, isLoading } = useCatalog();

  const category = categories.find((c) => c.slug.toLowerCase() === slug);

  if (isLoading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-text-muted">
        Loading category...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Category not found"
          description="This category may have been renamed or removed."
          actionLabel="Browse All Products"
          onAction={() => router.push('/shop')}
        />
      </div>
    );
  }

  const categoryProducts = products.filter(
    (p) =>
      p.category_id === category.id ||
      p.category_name?.toLowerCase() === category.name.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-8">
      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          { label: category.name },
        ]}
      />

      {/* Category Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#141414] via-[#1C180E] to-[#141414] border border-gold/30 p-7 sm:p-10 shadow-xl">
        <div className="max-w-2xl space-y-2.5">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            MW Trends Category
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-white">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Category Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Products ({categoryProducts.length})
          </span>
        </div>

        {categoryProducts.length === 0 ? (
          <EmptyState
            title="No products in this category yet"
            description="Products added to this category from Admin Portal will appear here."
            actionLabel="Browse All Shop"
            onAction={() => router.push('/shop')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
