'use client';

import * as React from 'react';
import { useWishlist } from '@/lib/store/wishlist-context';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/storefront/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistIds, clearWishlist } = useWishlist();

  const wishlistedProducts = INITIAL_PRODUCTS.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'My Wishlist' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Saved In Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Items saved for later or upcoming special occasions
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearWishlist}
            className="text-xs gap-1.5 text-text-muted hover:text-status-danger"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </Button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Your wishlist is empty"
          description="Explore our personalized gift collection and tap the heart icon on any product to save it here."
          actionLabel="Browse Collection"
          onAction={() => window.location.href = '/shop'}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
