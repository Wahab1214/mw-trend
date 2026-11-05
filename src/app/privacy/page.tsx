'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          How MW Trends safeguards your personal and payment details.
        </p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-serif font-bold text-base text-text-primary">1. Information We Collect</h3>
          <p>
            When placing an order or customizing a gift on MW Trends, we collect necessary contact information (name, shipping address, mobile phone number, email address, and personalized text inscriptions). We never store debit or credit card credentials on our servers.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary">2. Use of Information</h3>
          <p>
            Your information is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Print your custom inscriptions accurately.</li>
            <li>Coordinate shipping dispatch with registered couriers (TCS, Leopards).</li>
            <li>Send WhatsApp order tracking and delivery confirmation notifications.</li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary">3. Data Security</h3>
          <p>
            All communications and transactions are protected via industry-standard SSL 256-bit encryption. Your details are never sold, rented, or traded with third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
}
