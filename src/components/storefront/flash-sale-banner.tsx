'use client';

import * as React from 'react';
import Link from 'next/link';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INITIAL_FLASH_SALE } from '@/lib/mock-data';

export function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#141005] via-[#1F1707] to-[#141005] border-y border-gold/40 text-text-primary py-5 px-4 select-none relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Banner Title & Badge */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/50 flex items-center justify-center text-gold shrink-0 animate-pulse">
            <Flame className="w-5 h-5 fill-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-black px-2 py-0.5 rounded-full">
                FLASH SALE
              </span>
              <span className="text-xs font-serif font-bold text-gold">UP TO 40% OFF</span>
            </div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-white mt-0.5">
              {INITIAL_FLASH_SALE.title}
            </h3>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 sm:gap-3 bg-black/60 px-4 py-2 rounded-xl border border-gold/30 backdrop-blur-md">
          <Clock className="w-4 h-4 text-gold shrink-0 hidden sm:inline" />
          <div className="flex items-center gap-1.5 text-center">
            <div className="bg-surface px-2 py-1 rounded-md border border-border min-w-[34px]">
              <span className="text-sm font-mono font-bold text-gold block leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-text-muted">HRS</span>
            </div>
            <span className="text-gold font-bold">:</span>
            <div className="bg-surface px-2 py-1 rounded-md border border-border min-w-[34px]">
              <span className="text-sm font-mono font-bold text-gold block leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-text-muted">MIN</span>
            </div>
            <span className="text-gold font-bold">:</span>
            <div className="bg-surface px-2 py-1 rounded-md border border-border min-w-[34px]">
              <span className="text-sm font-mono font-bold text-gold block leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-text-muted">SEC</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link href="/shop?sale=true">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold uppercase tracking-wider text-xs shadow-md">
              <span>Claim Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
