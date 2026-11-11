'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Truck, X } from 'lucide-react';
import { useCatalog } from '@/lib/store/catalog-context';
import { formatPKR } from '@/lib/utils';

export function AnnouncementBar() {
  const pathname = usePathname();
  const { settings } = useCatalog();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || pathname?.startsWith('/admin')) return null;

  const threshold = Number(settings?.free_shipping_threshold || 0);
  if (threshold <= 0) return null;

  return (
    <div className="relative bg-[#121212] dark:bg-[#070707] text-[#FAF8F3] border-b border-gold/20 py-2 px-4 text-xs font-medium z-40 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-3">
        <div className="flex items-center gap-2 text-center truncate">
          <Truck className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="truncate">
            <span className="font-bold text-gold">FREE Delivery</span> across Pakistan on orders above{' '}
            <span className="text-gold font-bold">{formatPKR(threshold)}</span>
          </span>
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
