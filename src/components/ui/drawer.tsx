'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  side?: 'right' | 'left' | 'bottom';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sideClasses = {
    right: 'inset-y-0 right-0 max-w-md w-full animate-in slide-in-from-right duration-300',
    left: 'inset-y-0 left-0 max-w-md w-full animate-in slide-in-from-left duration-300',
    bottom: 'inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl animate-in slide-in-from-bottom duration-300',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={cn('fixed z-50 flex flex-col bg-surface border-border shadow-2xl text-text-primary', sideClasses[side], className)}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="font-serif font-bold text-lg text-text-primary">{title}</div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-elevated transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};
