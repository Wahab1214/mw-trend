'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Guidelines and conditions for shopping at MW Trends Pakistan.
        </p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-text-primary">1. Customization Accuracy</h3>
          <p>
            Customers are responsible for verifying the spelling, initials, date, and color choices submitted in customization input fields. Our automated engraving machines process the exact string entered.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary">2. Cash on Delivery Commitment</h3>
          <p>
            Cash on Delivery is a service of trust. Placing a fake or unverified order disrupts local courier riders and small business artisans. Customers who deliberately refuse delivered packages without valid reason may be blocked from future purchases.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary">3. Intellectual Property</h3>
          <p>
            The MW geometric monogram logo, product photography, and brand identity are registered trademarks of MW Trends Pakistan. Unauthorized duplication is prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
