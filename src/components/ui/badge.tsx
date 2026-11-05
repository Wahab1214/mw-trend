'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'gold' | 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'lavender' | 'pink';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/15 text-gold border-gold/30',
    default: 'bg-elevated text-text-secondary border-border',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    outline: 'bg-transparent text-text-primary border-border',
    lavender: 'bg-[#D9CFF0]/25 text-purple-700 dark:text-[#D9CFF0] border-purple-300 dark:border-purple-800',
    pink: 'bg-[#F4C6D0]/25 text-rose-700 dark:text-[#F4C6D0] border-rose-300 dark:border-rose-800',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors select-none tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
