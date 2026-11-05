'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 select-none space-y-6">
      <div className="font-serif font-black text-7xl sm:text-9xl text-gold/30">
        404
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          The personalized gift or page you were looking for might have been moved or is no longer available.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="gold" size="md" className="gap-2 font-bold uppercase tracking-wider text-xs">
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="md" className="gap-2 text-xs">
            <Compass className="w-4 h-4 text-gold" />
            <span>Browse Catalog</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
