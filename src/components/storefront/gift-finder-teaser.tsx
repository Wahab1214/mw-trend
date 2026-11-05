'use client';

import * as React from 'react';
import Link from 'next/link';
import { Gift, Compass, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GiftFinderTeaser() {
  return (
    <div className="my-10 rounded-3xl bg-gradient-to-r from-[#14120B] via-[#1C180E] to-[#14120B] border border-gold/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden select-none">
      {/* Background Decorative Sparkles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold">
            <Gift className="w-3.5 h-3.5" />
            <span>AI-POWERED GIFT CURATOR</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-black text-white leading-tight">
            Not Sure What To Gift?{' '}
            <span className="gold-gradient-text block sm:inline">Try Our 3-Step Wizard.</span>
          </h2>

          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Answer 3 quick questions about the recipient, occasion, and your budget in PKR. We will instantly recommend the most meaningful, personalized keepsake for them.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-text-muted pt-1">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-gold" /> Step 1: Who is it for?
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-gold" /> Step 2: What occasion?
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-gold" /> Step 3: What budget?
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <Link href="/gift-finder" className="w-full sm:w-auto">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto gap-2.5 text-sm uppercase tracking-wider font-extrabold shadow-gold-glow py-4 h-14"
            >
              <Compass className="w-5 h-5" />
              <span>Launch Gift Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
