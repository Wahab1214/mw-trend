'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
  charLimit?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, charLimit, id, value, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-semibold text-text-secondary tracking-wide uppercase">
              {label}
              {props.required && <span className="text-status-danger ml-1">*</span>}
            </label>
          )}
          {charLimit && (
            <span className={cn('text-xs font-mono', currentLength > charLimit ? 'text-status-danger font-bold' : 'text-text-muted')}>
              {currentLength} / {charLimit}
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          maxLength={charLimit}
          className={cn(
            'flex min-h-[90px] w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:cursor-not-allowed disabled:opacity-50 resize-y',
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
Textarea.displayName = 'Textarea';
