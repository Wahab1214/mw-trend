'use client';

import * as React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: 'Nationwide Express Shipping',
      description: 'Delivering to 250+ cities across Pakistan via TCS & Leopards.',
    },
    {
      icon: ShieldCheck,
      title: 'Cash on Delivery Guaranteed',
      description: 'Inspect your package and pay cash at your doorstep safely.',
    },
    {
      icon: Award,
      title: 'Premium Studio Grade Print',
      description: '24k gold foil printing & precision diamond laser engraving.',
    },
    {
      icon: RefreshCw,
      title: 'Damage-Free Guarantee',
      description: 'Instant free replacement if damaged in courier transit.',
    },
  ];

  return (
    <div className="py-8 border-y border-border bg-elevated/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-surface border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-text-primary">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
