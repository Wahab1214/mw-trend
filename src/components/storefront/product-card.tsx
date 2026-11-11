'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Price } from '@/components/ui/price';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/lib/store/wishlist-context';
import { useCart } from '@/lib/store/cart-context';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [isAdded, setIsAdded] = React.useState(false);

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product_id: product.id,
      title: product.title,
      image_url: primaryImage?.image_url || '/brand/monogram.svg',
      unit_price: product.sale_price || product.regular_price,
      unit_cost: product.base_cost_price,
      quantity: 1,
      allowed_payment_methods: product.allowed_payment_methods,
      mockup_type: product.mockup_type,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl bg-surface border border-border hover:border-gold/40 shadow-sm hover:shadow-gold-glow transition-all duration-300 overflow-hidden',
        className
      )}
    >
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-[#0D0D0D] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {primaryImage?.image_url ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.title}
              fill
              unoptimized={primaryImage.image_url.startsWith('data:')}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#141414] via-[#1B1811] to-[#0D0D0D] p-6 text-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-black/70 border border-gold/30 flex items-center justify-center p-2">
                <Image
                  src="/brand/monogram.svg"
                  alt="MW Trends"
                  width={32}
                  height={32}
                  className="object-contain opacity-85"
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
                Studio Photo Pending
              </span>
            </div>
          )}
        </Link>

        {/* Out of stock badge only when relevant */}
        {product.track_stock && product.stock_quantity <= 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="default" size="sm">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id, product.title);
          }}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={cn(
            'absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-sm',
            isWishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-black/60 text-white hover:text-gold hover:bg-black/80'
          )}
        >
          <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
        </button>

        {/* Quick Add To Bag overlay */}
        <div className="hidden sm:block absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              'w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all',
              isAdded ? 'bg-status-success text-white' : 'bg-gold hover:bg-gold-light text-black'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {product.category_name && (
            <span className="text-[10px] sm:text-[11px] font-medium text-text-muted uppercase tracking-wider block truncate">
              {product.category_name}
            </span>
          )}

          <h3 className="font-medium text-xs sm:text-sm text-text-primary line-clamp-2 hover:text-gold transition-colors leading-snug">
            <Link href={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
          <Price
            price={product.regular_price}
            salePrice={product.sale_price}
            size="sm"
            showBadge={false}
          />
          {product.reviews_count > 0 && (
            <Rating value={product.rating_average} count={product.reviews_count} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
}
