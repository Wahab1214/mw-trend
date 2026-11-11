'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { useCatalog } from '@/lib/store/catalog-context';

export function Footer() {
  const pathname = usePathname();
  const { categories, settings } = useCatalog();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-surface border-t border-border mt-16 pt-12 pb-24 lg:pb-12 text-xs text-text-secondary select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-border/60">
          {/* Column 1: Brand Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-black border border-gold/40 flex items-center justify-center p-1.5">
                <Image
                  src="/brand/monogram.svg"
                  alt="MW Trends Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg tracking-wider gold-gradient-text leading-tight">
                  MW
                </span>
                <span className="font-serif text-[9px] tracking-[0.3em] text-text-secondary font-medium">
                  TRENDS
                </span>
              </div>
            </Link>

            <p className="text-text-muted leading-relaxed">
              {settings?.tagline ||
                'Personalized gifts, custom cards, photo frames, Velvet Nikkah booklets, and laser-engraved keepsakes delivered across Pakistan.'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-elevated hover:bg-gold hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-elevated hover:bg-gold hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Dynamic Categories */}
          <div>
            <h4 className="font-serif font-bold text-text-primary uppercase tracking-wider text-xs mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-text-muted">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  Shop All Products
                </Link>
              </li>
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-gold transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-text-primary uppercase tracking-wider text-xs mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-text-muted">
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-gold transition-colors">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Contact */}
          <div>
            <h4 className="font-serif font-bold text-text-primary uppercase tracking-wider text-xs mb-4">
              Contact &amp; Payments
            </h4>
            <ul className="space-y-2.5 text-text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings?.store_address || 'Lahore, Pakistan'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{settings?.whatsapp_number || '+92 337 0566870'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{settings?.contact_email || 'support@mwtrends.pk'}</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-border/50">
              <span className="text-[10px] uppercase font-semibold text-text-muted block mb-2">
                Payment Methods
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-0.5 rounded bg-elevated border border-border text-text-primary">
                  COD
                </span>
                <span className="px-2 py-0.5 rounded bg-elevated border border-border text-rose-500">
                  JazzCash
                </span>
                <span className="px-2 py-0.5 rounded bg-elevated border border-border text-emerald-500">
                  Easypaisa
                </span>
                <span className="px-2 py-0.5 rounded bg-elevated border border-border text-text-primary">
                  Bank
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <strong className="text-text-primary">MW Trends</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
