'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { useCatalog } from '@/lib/store/catalog-context';

export function HeroSection() {
  const { settings } = useCatalog();
  const cleanPhone = (settings?.whatsapp_number || '923370566870').replace(/[^0-9]/g, '');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-surface pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-border select-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM GIFTING STUDIO • NATIONWIDE DELIVERY PAKISTAN</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight leading-[1.15]">
              Personalized Gifts Crafted{' '}
              <span className="gold-gradient-text block sm:inline">From The Heart.</span>
            </h1>

            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Shop Love Identity Cards, Spotify Music Plaques, Magic Mirror Frames, Velvet Nikkah Booklets, Engraved Wooden Pens, Custom Ceramic Mugs, and Personalized Photo Wallets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-sm uppercase tracking-wider font-bold"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-sm">
                  <MessageCircle className="w-4 h-4 text-gold" />
                  <span>Order on WhatsApp</span>
                </Button>
              </a>
            </div>

            {/* Store Guarantees */}
            <div className="pt-6 border-t border-border/60 grid grid-cols-3 gap-2 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">All Pakistan</strong>
                  <span className="text-text-muted">Fast Courier</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">COD Available</strong>
                  <span className="text-text-muted">Pay on Delivery</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-gold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[11px] leading-tight">
                  <strong className="block text-text-primary font-semibold">Custom Print</strong>
                  <span className="text-text-muted">Names &amp; Photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real Studio Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md aspect-square rounded-3xl p-5 bg-gradient-to-tr from-[#121212] via-[#1A1A1A] to-[#121212] border border-gold/40 shadow-2xl overflow-hidden flex flex-col justify-between group">
              <div className="flex justify-between items-start z-10">
                <div className="px-3 py-1 rounded-full bg-black/60 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  Featured Bestseller
                </div>
                <div className="w-9 h-9 rounded-xl bg-black border border-gold/50 flex items-center justify-center">
                  <Image
                    src="/brand/monogram.svg"
                    alt="MW Trends Monogram"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="relative my-auto w-full aspect-square max-h-[260px] overflow-hidden rounded-2xl">
                <Image
                  src="/products/love-identity-card-1.jpg"
                  alt="MW Trends Personalized Love Identity Card"
                  fill
                  priority
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-serif text-gold block">Custom Cards</span>
                  <h3 className="text-sm font-bold truncate">Personalized Love Identity Card</h3>
                </div>
              </div>

              <Link
                href="/product/personalized-love-identity-card"
                className="z-10 w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-black text-center text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Customize Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
