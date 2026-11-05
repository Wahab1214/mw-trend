'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {(label || description) && (
        <div className="space-y-0.5">
          {label && <span className="text-sm font-medium text-text-primary block">{label}</span>}
          {description && <span className="text-xs text-text-muted block">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-gold' : 'bg-elevated border-border'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5 bg-black' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
