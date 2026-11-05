'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  Flame,
  Gift,
  Settings,
  ShieldCheck,
  History,
  Store,
  ExternalLink,
  X
} from 'lucide-react';

export interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Catalog', href: '/admin/products', icon: Package },
    { name: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customer Base', href: '/admin/customers', icon: Users },
    { name: 'Reviews Moderation', href: '/admin/reviews', icon: MessageSquare },
    {
      name: 'Marketing Engine',
      icon: Tag,
      children: [
        { name: 'Coupons & Discounts', href: '/admin/marketing/coupons' },
        { name: 'Flash Sales', href: '/admin/marketing/flash-sales' },
        { name: 'Combos & Bundles', href: '/admin/marketing/bundles' },
      ],
    },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'Staff & Roles (RBAC)', href: '/admin/team', icon: ShieldCheck },
    { name: 'Audit & Activity Log', href: '/admin/audit-logs', icon: History },
  ];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F0F] border-r border-[#262626] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 select-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div>
        {/* Header & Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#262626]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-gold/50 flex items-center justify-center p-1">
              <Image
                src="/brand/monogram.svg"
                alt="MW Trends Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-sm tracking-wider gold-gradient-text">
                MW ADMIN
              </span>
              <span className="text-[9px] tracking-widest text-[#888888] font-semibold">
                STUDIO DESK
              </span>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-[#888888] hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navigation.map((item) => {
            if (item.children) {
              const isChildActive = item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.name} className="space-y-1 pt-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          'block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          pathname === child.href
                            ? 'bg-gold/20 text-gold font-bold'
                            : 'text-[#AAAAAA] hover:text-white hover:bg-[#1E1E1E]'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-gold text-black font-bold shadow-gold-glow'
                    : 'text-[#CCCCCC] hover:text-white hover:bg-[#1C1C1C]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return link */}
      <div className="p-4 border-t border-[#262626]">
        <Link
          href="/"
          className="flex items-center justify-between p-2 rounded-xl bg-[#181818] hover:bg-[#202020] text-[#AAAAAA] hover:text-gold transition-colors text-xs font-medium"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span>Storefront Live</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
