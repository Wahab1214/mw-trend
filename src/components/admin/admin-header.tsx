'use client';

import * as React from 'react';
import { Menu, Bell, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export interface AdminHeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export function AdminHeader({ onMenuToggle, title = 'Administration' }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-surface border-b border-border select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-serif font-bold text-base sm:text-lg text-text-primary">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Role indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role: Owner (Full Access)</span>
        </div>

        {/* Theme switcher */}
        <ThemeToggle />

        {/* Staff avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center font-bold text-xs text-gold">
          MW
        </div>
      </div>
    </header>
  );
}
