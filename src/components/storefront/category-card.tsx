'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-[#121212] border border-border hover:border-gold/50 shadow-sm transition-all duration-300 aspect-[4/5] select-none',
        className
      )}
    >
      {/* Background Image */}
      {category.image_url && (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
        />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative mt-auto p-4 flex items-end justify-between z-10">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gold tracking-widest block mb-0.5">
            {category.product_count || 12}+ Items
          </span>
          <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-gold transition-colors">
            {category.name}
          </h3>
        </div>

        <div className="w-8 h-8 rounded-full bg-surface/80 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
