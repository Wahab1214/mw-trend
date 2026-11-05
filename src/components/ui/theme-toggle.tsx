'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9 rounded-lg bg-elevated/40 border border-border/40', className)} />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface text-text-secondary hover:text-gold hover:border-gold/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40',
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform rotate-0 hover:rotate-90 duration-300 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 transition-transform -rotate-12 hover:rotate-0 duration-300 text-gold-dark" />
      )}
    </button>
  );
}
