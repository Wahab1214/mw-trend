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
import { Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
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

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const secondaryImage = product.images[1] || primaryImage;

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
      customization_data: product.has_customization
        ? { name_text: 'MW CUSTOM' }
        : undefined,
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
          {primaryImage && (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.title}
              fill
              unoptimized={primaryImage.image_url.startsWith('data:')}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.is_trending && (
            <Badge variant="gold" size="sm">
              Trending
            </Badge>
          )}
          {product.is_new && !product.is_trending && (
            <Badge variant="default" size="sm">
              New Drop
            </Badge>
          )}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge variant="warning" size="sm">
              Only {product.stock_quantity} left
            </Badge>
          )}
        </div>

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
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              'w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all',
              isAdded
                ? 'bg-status-success text-white'
                : 'bg-gold hover:bg-gold-light text-black'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {product.category_name && (
            <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
              {product.category_name}
            </span>
          )}

          <h3 className="font-medium text-xs sm:text-sm text-text-primary line-clamp-2 hover:text-gold transition-colors leading-snug">
            <Link href={`/product/${product.slug}`}>{product.title}</Link>
          </h3>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <Price
            price={product.regular_price}
            salePrice={product.sale_price}
            size="sm"
          />
          <Rating value={product.rating_average} count={product.reviews_count} size="sm" />
        </div>

        {product.has_customization && (
          <div className="pt-1 flex items-center gap-1 text-[10px] text-gold font-medium">
            <Sparkles className="w-3 h-3 text-gold" />
            <span>Custom Name &amp; Live 3D Preview</span>
          </div>
        )}
      </div>
    </div>
  );
}
