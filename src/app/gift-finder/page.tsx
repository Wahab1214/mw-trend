'use client';

import * as React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/storefront/product-card';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types';
import { Gift, Compass, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

export default function GiftFinderPage() {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [recipient, setRecipient] = React.useState<string>('');
  const [occasion, setOccasion] = React.useState<string>('');
  const [budgetRange, setBudgetRange] = React.useState<string>('');

  const recipients = [
    { id: 'him', label: 'For Him', desc: 'Husband, Boyfriend, Brother, Father', icon: '👔' },
    { id: 'her', label: 'For Her', desc: 'Wife, Girlfriend, Sister, Mother', icon: '✨' },
    { id: 'bestie', label: 'Best Friend', desc: 'Partner in crime, Childhood friend', icon: '👯' },
    { id: 'couple', label: 'Couple / Duo', desc: 'Anniversary, Wedding, Newlyweds', icon: '💍' },
    { id: 'colleague', label: 'Colleague / Boss', desc: 'Corporate, Promotion, Farewell', icon: '💼' },
  ];

  const occasions = [
    { id: 'birthday', label: 'Birthday', desc: 'Personalized surprises', icon: '🎂' },
    { id: 'anniversary', label: 'Anniversary & Love', desc: 'Romantic keepsakes', icon: '❤️' },
    { id: 'friendship', label: 'Friendship Day', desc: 'Witty inside jokes', icon: '🤝' },
    { id: 'eid', label: 'Eid Mubarak', desc: 'Festive family gifts', icon: '🌙' },
    { id: 'graduation', label: 'Graduation / Milestone', desc: 'Executive pens & sets', icon: '🎓' },
    { id: 'just_because', label: 'Just Because', desc: 'Thoughtful everyday token', icon: '🎁' },
  ];

  const budgets = React.useMemo(() => [
    { id: 'under_1000', label: 'Under Rs. 1,000', desc: 'Cards, Mugs, Laser Pens', min: 0, max: 1000 },
    { id: '1000_2000', label: 'Rs. 1,000 – Rs. 2,000', desc: 'Streetwear Tees, Caps, Tumblers', min: 1000, max: 2000 },
    { id: '2000_3500', label: 'Rs. 2,000 – Rs. 3,500', desc: 'Curated Combos & Hoodies', min: 2000, max: 3500 },
    { id: 'above_3500', label: 'Rs. 3,500+', desc: 'Luxury Gift Hampers & Premium Bundles', min: 3500, max: 10000 },
  ], []);

  const resetWizard = () => {
    setRecipient('');
    setOccasion('');
    setBudgetRange('');
    setStep(1);
  };

  // Recommendations calculation
  const recommendedProducts: Product[] = React.useMemo(() => {
    if (step !== 4) return [];

    const selectedBudget = budgets.find((b) => b.id === budgetRange);
    const min = selectedBudget?.min ?? 0;
    const max = selectedBudget?.max ?? 10000;

    let list = INITIAL_PRODUCTS.filter((p) => {
      const price = p.sale_price || p.regular_price;
      return price >= min && price <= max;
    });

    if (list.length === 0) {
      list = INITIAL_PRODUCTS.slice(0, 4);
    }

    return list;
  }, [step, budgetRange, budgets]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Gift Finder Wizard' }]} />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>3-STEP INTERACTIVE GIFT FINDER</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Find The Perfect Gift
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Personalized recommendations tailored to your loved ones in Pakistan.
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-1.5 rounded-full transition-all ${
              step >= s ? 'bg-gold' : 'bg-elevated'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: Who is it for? */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="text-center">
            <h2 className="font-serif font-bold text-xl text-text-primary">
              Step 1: Who are you shopping for?
            </h2>
            <p className="text-xs text-text-muted mt-1">Select the lucky recipient</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipients.map((r) => {
              const isSelected = recipient === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRecipient(r.id);
                    setStep(2);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/15 shadow-gold-glow'
                      : 'border-border bg-surface hover:border-gold/40'
                  }`}
                >
                  <span className="text-2xl block mb-2">{r.icon}</span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-text-primary">
                    {r.label}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: What is the occasion? */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="text-center">
            <h2 className="font-serif font-bold text-xl text-text-primary">
              Step 2: What celebration or occasion?
            </h2>
            <p className="text-xs text-text-muted mt-1">Help us match the right theme &amp; typography</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {occasions.map((o) => {
              const isSelected = occasion === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setOccasion(o.id);
                    setStep(3);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/15 shadow-gold-glow'
                      : 'border-border bg-surface hover:border-gold/40'
                  }`}
                >
                  <span className="text-2xl block mb-2">{o.icon}</span>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-text-primary">
                    {o.label}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">{o.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-text-muted hover:text-gold transition-colors"
            >
              &larr; Back to Step 1
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: What is your budget? */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="text-center">
            <h2 className="font-serif font-bold text-xl text-text-primary">
              Step 3: What is your preferred budget?
            </h2>
            <p className="text-xs text-text-muted mt-1">In Pakistani Rupees (PKR)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const isSelected = budgetRange === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBudgetRange(b.id);
                    setStep(4);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/15 shadow-gold-glow'
                      : 'border-border bg-surface hover:border-gold/40'
                  }`}
                >
                  <h3 className="font-serif font-bold text-base text-gold">
                    {b.label}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">{b.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-text-muted hover:text-gold transition-colors"
            >
              &larr; Back to Step 2
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Results Showcase */}
      {step === 4 && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-gold/15 via-surface to-gold/15 border border-gold/40 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-black text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Match Found</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-text-primary">
              Recommended Gifts For You
            </h2>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              Based on your preferences, these personalized items are guaranteed to make their day truly special.
            </p>

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetWizard}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
