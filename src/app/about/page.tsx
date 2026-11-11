'use client';

import * as React from 'react';
import Image from 'next/image';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';

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
          MW Trends is dedicated to celebrating life&apos;s most meaningful milestones with personalized identity cards, custom photo frames, Velvet Nikkah booklets, engraved pens, and thoughtful gift sets across Pakistan.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121212] via-[#1B1810] to-[#0D0D0D] border border-gold/40 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 shadow-xl">
        <div className="w-24 h-24 rounded-2xl bg-black border border-gold/50 flex items-center justify-center p-4 shrink-0 shadow-gold-glow">
          <Image
            src="/brand/monogram.svg"
            alt="MW Trends Studio"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest block">
            MW Trends Studio
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Every Gift Customized to Order
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            From high-gloss PVC keepsake cards and glowing LED frames to precision laser-engraved executive pens and custom ceramic mugs, every order is individually finished and quality-checked before dispatch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <Award className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Studio Quality</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every photo frame, identity card, engraved pen, and ceramic mug is crafted using durable fade-resistant finishes.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <Heart className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Personal Touch</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            We carefully review every name, date, and custom photo before printing so your gift arrives spotless.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2">
          <ShieldCheck className="w-6 h-6 text-gold" />
          <h3 className="font-serif font-bold text-base text-text-primary">Nationwide COD</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Fast courier delivery across 250+ cities in Pakistan with Cash on Delivery available.
          </p>
        </div>
      </div>
    </div>
  );
}
