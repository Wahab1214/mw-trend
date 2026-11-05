'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gold hover:bg-gold-dark text-black dark:text-black font-semibold shadow-sm hover:shadow-gold-glow',
      secondary:
        'bg-elevated hover:bg-surface text-text-primary border border-border hover:border-gold/30',
      outline:
        'border border-border hover:border-gold text-text-primary hover:text-gold bg-transparent',
      ghost:
        'text-text-secondary hover:text-text-primary hover:bg-elevated/60 bg-transparent',
      danger:
        'bg-status-danger text-white hover:bg-rose-700 shadow-sm',
      gold:
        'bg-gradient-to-r from-gold-light via-gold to-gold-dark text-black font-bold shadow-gold-glow hover:brightness-110',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
