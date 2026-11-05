'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start space-x-3 select-none">
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-5 w-5 rounded border border-border bg-surface transition-all peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 cursor-pointer flex items-center justify-center',
              className
            )}
          >
            <Check className="h-3.5 w-3.5 text-black stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {(label || description) && (
          <div className="space-y-0.5 cursor-pointer" onClick={() => {
            const input = document.getElementById(checkboxId) as HTMLInputElement;
            if (input) input.click();
          }}>
            {label && <label htmlFor={checkboxId} className="text-sm font-medium text-text-primary cursor-pointer">{label}</label>}
            {description && <p className="text-xs text-text-muted">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
