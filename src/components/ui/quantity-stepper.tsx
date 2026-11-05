'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  disabled = false,
  className,
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-border bg-surface select-none shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="flex h-full w-9 items-center justify-center text-text-secondary hover:text-gold hover:bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-l-lg"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <div className="flex h-full min-w-[36px] items-center justify-center px-2 font-mono font-medium text-text-primary border-x border-border/50">
        {value}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-9 items-center justify-center text-text-secondary hover:text-gold hover:bg-elevated transition-colors disabled:opacity-30 disabled:cursor-not-allowed rounded-r-lg"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
