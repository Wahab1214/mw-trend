'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, helperText, id, options, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
            {label}
            {props.required && <span className="text-status-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 pr-9 text-sm text-text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-status-danger focus:ring-status-danger/40 focus:border-status-danger',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {helperText && !error && <p className="text-xs text-text-muted">{helperText}</p>}
        {error && <p className="text-xs text-status-danger font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
