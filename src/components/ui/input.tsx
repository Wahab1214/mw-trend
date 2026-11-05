'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
            {label}
            {props.required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-status-danger focus:ring-status-danger/40 focus:border-status-danger',
            className
          )}
          {...props}
        />
        {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
        {error && <p className="text-xs text-status-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
