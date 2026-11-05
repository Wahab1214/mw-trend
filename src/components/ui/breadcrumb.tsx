'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-text-muted py-2 select-none overflow-x-auto no-scrollbar', className)}>
      <ol className="inline-flex items-center space-x-1 sm:space-x-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center hover:text-gold transition-colors text-text-secondary"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-text-muted/60 mx-1 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gold transition-colors text-text-secondary truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-text-primary truncate max-w-[180px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
