'use client';

import * as React from 'react';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Sparkles, Award, Heart, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-12">
      <Breadcrumb items={[{ label: 'About MW Trends' }]} />

      <div className="text-center space-y-4">
        <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Our Heritage &amp; Craft
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-text-primary leading-tight">
          Crafting Personalized Keepsakes With Pakistani Precision.
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Founded in Lahore, MW Trends is Pakistan&apos;s leading print-on-demand studio dedicated to celebrating life&apos;s most meaningful relationships.
        </p>
      </div>

      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-elevated border border-border">
        <Image
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
          alt="MW Trends Studio"
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <Award className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Studio Quality</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every mug, pen, and hoodie uses industrial-grade laser etching, 24k foil, and bio-washed heavyweight cotton.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <Heart className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Empathy First</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            We understand gifts are emotions in physical form. We inspect every letter, font, and curve before sealing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <ShieldCheck className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Reliable Delivery</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            24-48 hour courier dispatch across 250+ cities with cash on delivery guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
