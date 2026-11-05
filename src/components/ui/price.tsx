'use client';

import * as React from 'react';
import { cn, formatPKR } from '@/lib/utils';
import { Badge } from './badge';

export interface PriceProps {
  price: number;
  salePrice?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export const Price: React.FC<PriceProps> = ({
  price,
  salePrice,
  size = 'md',
  showBadge = true,
  className,
}) => {
  const isSale = salePrice !== undefined && salePrice !== null && salePrice < price;
  const currentPrice = isSale ? salePrice : price;
  const discountPercent = isSale ? Math.round(((price - salePrice) / price) * 100) : 0;

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl sm:text-3xl font-extrabold',
  };

  const strikethroughSizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
  };

  return (
    <div className={cn('inline-flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('text-gold font-serif tracking-tight', sizeClasses[size])}>
        {formatPKR(currentPrice)}
      </span>

      {isSale && (
        <>
          <span className={cn('line-through text-text-muted font-normal', strikethroughSizes[size])}>
            {formatPKR(price)}
          </span>
          {showBadge && discountPercent > 0 && (
            <Badge variant="gold" size="sm">
              Save {discountPercent}%
            </Badge>
          )}
        </>
      )}
    </div>
  );
};
