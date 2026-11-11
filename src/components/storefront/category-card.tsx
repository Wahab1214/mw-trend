'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCatalog } from '@/lib/store/catalog-context';

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const { products } = useCatalog();

  const matchingProducts = products.filter((p) => p.category_id === category.id);
  const firstProductWithImg = matchingProducts.find((p) => p.images && p.images.length > 0);
  const displayImage =
    category.image_url || firstProductWithImg?.images?.[0]?.image_url || null;
  const itemCount =
    matchingProducts.length > 0 ? matchingProducts.length : category.product_count ?? 0;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-[#121212] border border-border hover:border-gold/50 shadow-sm transition-all duration-300 aspect-[4/5] select-none',
        className
      )}
    >
      {displayImage ? (
        <Image
          src={displayImage}
          alt={category.name}
          fill
          unoptimized={displayImage.startsWith('data:')}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#141414] via-[#1B1811] to-[#0D0D0D] p-6">
          <div className="w-14 h-14 rounded-2xl bg-black/70 border border-gold/30 flex items-center justify-center p-2.5 opacity-80 group-hover:scale-105 transition-transform">
            <Image
              src="/brand/monogram.svg"
              alt="MW Trends"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      <div className="relative mt-auto p-4 flex items-end justify-between z-10">
        <div>
          <span className="text-[10px] uppercase font-semibold text-gold tracking-widest block mb-0.5">
            {itemCount} {itemCount === 1 ? 'Product' : 'Products'}
          </span>
          <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-gold transition-colors">
            {category.name}
          </h3>
        </div>

        <div className="w-8 h-8 rounded-full bg-surface/80 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
