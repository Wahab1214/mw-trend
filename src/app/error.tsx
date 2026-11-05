'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 select-none space-y-6">
      <div className="w-16 h-16 rounded-full bg-status-danger/10 text-status-danger flex items-center justify-center mx-auto text-2xl font-bold">
        !
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Something Went Wrong
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          We encountered an unexpected error. Our studio engineering desk has been notified.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="gold"
          size="md"
          onClick={() => reset()}
          className="gap-2 font-bold uppercase tracking-wider text-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" size="md" className="gap-2 text-xs">
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
