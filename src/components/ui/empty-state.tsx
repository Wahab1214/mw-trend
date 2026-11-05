'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PackageOpen } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50 max-w-lg mx-auto my-6',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-gold mb-4 shadow-sm">
        {icon || <PackageOpen className="h-8 w-8 stroke-[1.5]" />}
      </div>
      <h3 className="font-serif text-lg font-bold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary max-w-xs mb-6">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="gold" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
