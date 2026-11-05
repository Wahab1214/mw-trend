'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Truck, X } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#121212] dark:bg-[#070707] text-[#FAF8F3] border-b border-gold/20 py-2 px-4 text-xs font-medium z-40 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3">
        <div className="flex items-center gap-2 text-center truncate">
          <Truck className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
          <span className="truncate">
            <span className="font-bold text-gold">FREE Express Delivery</span> on all orders over{' '}
            <span className="text-gold font-bold">Rs. 3,000</span> across Pakistan!
          </span>
          <span className="hidden md:inline-block text-text-muted">•</span>
          <Link
            href="/shop?sale=true"
            className="hidden md:inline-flex items-center gap-1 text-gold hover:underline font-semibold"
          >
            <Sparkles className="w-3 h-3" />
            Mid-Season Drop Live
          </Link>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-text-muted hover:text-white p-0.5 rounded transition-colors shrink-0 sm:absolute sm:right-4"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
