'use client';

import * as React from 'react';
import { Rating } from '@/components/ui/rating';
import { Review } from '@/types';
import { ShieldCheck, Quote, Sparkles } from 'lucide-react';

export function TestimonialsSection() {
  const [reviews, setReviews] = React.useState<Review[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_reviews');
      if (stored) {
        const list = JSON.parse(stored);
        setReviews(list.filter((r: Review) => r.is_approved && r.is_featured));
      }
    } catch {
      // ignore
    }
  }, []);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="py-10 select-none">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Real Customer Feedback
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Verified Reviews
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Crafted with care in Pakistan. Here is what verified buyers say about our personalized gifts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-surface border border-border hover:border-gold/40 shadow-sm transition-all duration-300 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Rating value={review.rating} size="sm" />
                <Quote className="w-5 h-5 text-gold/30" />
              </div>

              {review.title && (
                <h4 className="font-serif font-bold text-sm text-text-primary">
                  &quot;{review.title}&quot;
                </h4>
              )}

              <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">
                {review.comment}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <strong className="text-xs font-semibold text-text-primary block">
                  {review.author_name}
                </strong>
                <span className="text-[10px] text-text-muted">Pakistan</span>
              </div>

              {review.is_verified_buyer && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Buyer</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
