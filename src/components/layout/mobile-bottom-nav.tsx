'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { useWishlist } from '@/lib/store/wishlist-context';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Hide in admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Compass },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-3 py-1.5 shadow-lg select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors',
                isActive ? 'text-gold font-bold' : 'text-text-muted hover:text-text-primary'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-black">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center py-1 px-3 text-[10px] font-medium text-text-muted hover:text-gold transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Bag</span>
          {itemCount > 0 && (
            <span className="absolute top-0 right-2 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-black">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
