'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingProps {
  value: number; // 0 - 5
  max?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  count,
  size = 'sm',
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentDisplay = hoverRating !== null ? hoverRating : value;

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= Math.round(currentDisplay);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                'focus:outline-none transition-colors',
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  starSizes[size],
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-transparent text-border-light text-text-muted/40'
                )}
              />
            </button>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs text-text-muted font-medium">({count})</span>
      )}
    </div>
  );
};
