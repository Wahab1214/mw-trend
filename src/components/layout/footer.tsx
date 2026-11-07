'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Instagram, Facebook, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide storefront footer on admin studio and login pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-surface border-t border-border mt-16 pt-12 pb-24 lg:pb-12 text-xs text-text-secondary select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-border">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center p-1.5 border border-gold/40 shadow-sm">
                <Image
                  src="/brand/monogram.svg"
                  alt="MW Trends Monogram"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl tracking-wider gold-gradient-text leading-tight">
                  MW
                </span>
                <span className="font-serif text-[9px] tracking-[0.3em] text-text-secondary font-medium">
                  TRENDS
                </span>
              </div>
            </Link>

            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              Pakistan&apos;s premier print-on-demand studio and personalized gift atelier. Crafting high-grade monogram mugs, laser-etched pens, heavyweight cotton streetwear tees, and bespoke romantic greeting cards.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/mwtrends.pk"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/mwtrendspk"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                aria-label="Contact Desk"
                className="w-8 h-8 rounded-lg bg-elevated border border-border flex items-center justify-center text-text-secondary hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-text-primary tracking-wide">
              Top Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/custom-mugs" className="hover:text-gold transition-colors">
                  Custom Mugs
                </Link>
              </li>
              <li>
                <Link href="/category/luxury-pens" className="hover:text-gold transition-colors">
                  Laser-Engraved Pens
                </Link>
              </li>
              <li>
                <Link href="/category/apparel-t-shirts" className="hover:text-gold transition-colors">
                  Heavyweight T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/category/hoodies-sweatshirts" className="hover:text-gold transition-colors">
                  Fleece Hoodies
                </Link>
              </li>
              <li>
                <Link href="/category/custom-caps" className="hover:text-gold transition-colors">
                  Embroidered Caps
                </Link>
              </li>
              <li>
                <Link href="/category/love-cards" className="hover:text-gold transition-colors">
                  Love &amp; Anniversary Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Service */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-text-primary tracking-wide">
              Customer Desk
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors font-medium text-gold">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/gift-finder" className="hover:text-gold transition-colors">
                  Gift Finder Wizard
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-gold transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-text-primary tracking-wide">
              MW Studio HQ
            </h4>
            <ul className="space-y-2 text-text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Gulberg III, Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>wmofficial11@gmail.com</span>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Nationwide Courier Dispatch</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Badges & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-text-muted">Accepted Payment Methods:</span>
            <span className="px-2 py-0.5 rounded bg-elevated font-semibold text-text-primary border border-border">Cash on Delivery</span>
            <span className="px-2 py-0.5 rounded bg-elevated font-semibold text-text-primary border border-border">JazzCash</span>
            <span className="px-2 py-0.5 rounded bg-elevated font-semibold text-text-primary border border-border">Easypaisa</span>
            <span className="px-2 py-0.5 rounded bg-elevated font-semibold text-text-primary border border-border">Bank Transfer (Raast)</span>
            <span className="px-2 py-0.5 rounded bg-elevated font-semibold text-text-primary border border-border">Visa &amp; Mastercard</span>
          </div>

          <p className="text-text-muted text-[11px] text-center sm:text-right">
            &copy; {new Date().getFullYear()} MW Trends. All rights reserved. Crafted with precision in Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}
