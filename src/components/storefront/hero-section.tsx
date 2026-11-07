'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Gift } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-surface pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-border select-none">
      {/* Decorative Gold Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>HANDCRAFTED IN PAKISTAN • EXPRESS NATIONWIDE DISPATCH</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.15]">
              Make Everyday Moments{' '}
              <span className="gold-gradient-text block sm:inline">Unforgettable.</span>
            </h1>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Elevate your gifting with laser-engraved luxury pens, 24k gold monogram ceramic mugs, 240 GSM streetwear apparel, and Italian gold-foil greeting cards. Personalized in minutes with live 3D preview.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full sm:w-auto gap-2 text-sm uppercase tracking-wider font-bold">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/gift-finder" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-sm">
                  <Gift className="w-4 h-4 text-gold" />
                  <span>Interactive Gift Finder</span>
                </Button>
              </Link>
            </div>

            {/* Reassurance Micro-Badges */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">24-48h Delivery</strong>
                  <span className="text-text-muted">TCS / Leopards</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">COD Available</strong>
                  <span className="text-text-muted">Pay at doorstep</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">Live 3D Preview</strong>
                  <span className="text-text-muted">WYSIWYG Print</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Monogram Feature Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md aspect-square rounded-3xl p-6 bg-gradient-to-tr from-[#121212] via-[#1A1A1A] to-[#121212] border border-gold/40 shadow-2xl overflow-hidden flex flex-col justify-between group">
              {/* Geometric Monogram Emblem */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <div className="px-3 py-1 rounded-full bg-black/60 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Signature Edition
                </div>
                <div className="w-9 h-9 rounded-xl bg-black border border-gold/50 flex items-center justify-center">
                  <Image
                    src="/brand/monogram.svg"
                    alt="MW Trends Monogram"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Product Hero Image */}
              <div className="relative my-auto w-full aspect-square max-h-[250px] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
                  alt="MW Trends Bespoke Gifts"
                  fill
                  priority
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-serif text-gold block">MW Trends Atelier</span>
                  <h3 className="text-sm font-bold truncate">Bespoke Personalized Gifts</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gold font-serif font-extrabold text-xs">Nationwide Express COD</span>
                    <span className="text-[10px] bg-gold/20 text-gold border border-gold/40 px-2 py-0.5 rounded-full">
                      Custom Name &amp; Foil
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <Link
                href="/shop"
                className="z-10 w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-black text-center text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Explore Collection &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
