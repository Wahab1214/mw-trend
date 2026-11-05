'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_COLLECTIONS } from '@/lib/mock-data';
import { Sparkles, ArrowRight } from 'lucide-react';

export function OccasionCarousel() {
  const occasionBadges: Record<string, { bg: string; text: string; border: string }> = {
    "Valentine's Day": { bg: 'bg-[#F4C6D0]/20', text: 'text-rose-600 dark:text-[#F4C6D0]', border: 'border-rose-300 dark:border-rose-900' },
    'Friendship Day': { bg: 'bg-[#D9CFF0]/20', text: 'text-purple-600 dark:text-[#D9CFF0]', border: 'border-purple-300 dark:border-purple-900' },
    'Eid Mubarak': { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
    Birthday: { bg: 'bg-gold/15', text: 'text-gold', border: 'border-gold/30' },
    'Anniversary & Wedding': { bg: 'bg-amber-500/15', text: 'text-amber-500', border: 'border-amber-500/30' },
  };

  return (
    <div className="py-4 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated For Pakistan Celebrations
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
            Shop By Occasion
          </h2>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {INITIAL_COLLECTIONS.map((col) => {
          const badgeStyle = occasionBadges[col.occasion_type || ''] || {
            bg: 'bg-elevated',
            text: 'text-text-primary',
            border: 'border-border',
          };

          return (
            <Link
              key={col.id}
              href={`/collection/${col.slug}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-border hover:border-gold/50 shadow-sm transition-all duration-300 p-4 space-y-3"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-elevated">
                {col.image_url && (
                  <Image
                    src={col.image_url}
                    alt={col.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {col.occasion_type}
                </span>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-text-primary mt-2 group-hover:text-gold transition-colors">
                  {col.name}
                </h3>
                <span className="text-[11px] text-text-muted mt-0.5 block">
                  {col.product_count} Gift Ideas
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
