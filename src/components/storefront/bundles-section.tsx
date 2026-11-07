'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_BUNDLES } from '@/lib/mock-data';
import { formatPKR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/store/cart-context';
import { Gift, Sparkles, Check, ArrowRight } from 'lucide-react';

export function BundlesSection() {
  const { addItem } = useCart();
  const [addedBundleId, setAddedBundleId] = React.useState<string | null>(null);
  const [bundles, setBundles] = React.useState<typeof INITIAL_BUNDLES>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_bundles');
      if (stored) {
        setBundles(JSON.parse(stored).filter((b: any) => b.is_active));
      }
    } catch {
      // ignore
    }
  }, []);

  if (bundles.length === 0) {
    return null;
  }

  const handleAddBundle = (bundle: typeof INITIAL_BUNDLES[0]) => {
    addItem({
      product_id: bundle.id,
      title: bundle.title,
      image_url: bundle.image_url || '/brand/monogram.svg',
      unit_price: bundle.bundle_price,
      unit_cost: 600,
      quantity: 1,
      allowed_payment_methods: ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer', 'Card'],
      customization_data: { name_text: 'COMBO GIFT' },
    });

    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 1500);
  };

  return (
    <div className="py-6 select-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5" />
            Curated Gift Sets
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary mt-1">
            Combos &amp; Gift Bundles
          </h2>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundles.map((bundle) => {
          const savings = bundle.compare_at_price - bundle.bundle_price;
          const isAdded = addedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-gold/50 shadow-sm transition-all duration-300 overflow-hidden"
            >
              <div className="relative w-full aspect-[16/10] bg-elevated overflow-hidden">
                {bundle.image_url && (
                  <Image
                    src={bundle.image_url}
                    alt={bundle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gold text-black text-[10px] font-bold uppercase tracking-wider">
                  Save {formatPKR(savings)}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-text-primary group-hover:text-gold transition-colors">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {bundle.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-text-muted block line-through">
                      {formatPKR(bundle.compare_at_price)}
                    </span>
                    <span className="text-lg font-serif font-bold text-gold">
                      {formatPKR(bundle.bundle_price)}
                    </span>
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => handleAddBundle(bundle)}
                    className="gap-1.5 font-bold uppercase tracking-wider text-xs"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add Combo</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
