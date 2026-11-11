'use client';

import * as React from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ShippingReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Shipping & Returns' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Shipping &amp; Returns Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Fast nationwide delivery across Pakistan with guaranteed damage-free arrival.
        </p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-text-primary flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold" />
            <span>1. Nationwide Delivery Rates &amp; Timelines</span>
          </h3>
          <p>
            MW Trends ships to all urban and rural destinations across Pakistan. Orders above <strong>Rs. 3,000</strong> qualify for <strong>FREE Express Delivery</strong>. Standard flat-rate delivery across Pakistan is <strong>Rs. 250</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Lahore Studio Hub:</strong> Same day dispatch, 24 hour doorstep delivery.</li>
            <li><strong>Karachi, Islamabad, Rawalpindi, Faisalabad:</strong> 1 - 2 business days.</li>
            <li><strong>Other Cities &amp; Regions:</strong> 2 - 4 business days via TCS, Leopards or Call Courier.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-gold" />
            <span>2. Returns &amp; Print-on-Demand Policy</span>
          </h3>
          <p>
            Because personalized gifts are made-to-order with your recipient custom name, initial, or message, we cannot accept returns due to buyer remorse or change of mind once printing has commenced.
          </p>
          <p>
            However, we provide a <strong>100% Free Replacement Guarantee</strong> in the following events:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Product arrived damaged, chipped, or broken in transit.</li>
            <li>Spelling or printing error caused by our studio discrepancy against your order notes.</li>
            <li>Wrong size or color dispatched.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-serif font-bold text-base text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span>3. How to Claim a Free Replacement</span>
          </h3>
          <p>
            Within 48 hours of delivery, take a clear photo of the parcel and defective item, then send it to our WhatsApp helpline at <strong>+92 337 0566870</strong> along with your Order Reference Number (e.g. MW-001041). Our quality desk will dispatch a replacement piece immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
