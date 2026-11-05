'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { formatPKR } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  Gift,
  Truck,
  Tag,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    giftWrapFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isGiftWrapped,
    setIsGiftWrapped,
    giftMessage,
    setGiftMessage,
    amountNeededForFreeShipping,
    freeShippingThreshold,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = React.useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput);
    if (success) setCouponCodeInput('');
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - amountNeededForFreeShipping) / freeShippingThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

      <div className="border-b border-border pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review your personalized orders and proceed to secure checkout
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Your bag is currently empty"
          description="Discover our best-selling customized mugs, laser engraved pens, and romantic cards."
          actionLabel="Explore Catalog"
          onAction={() => window.location.href = '/shop'}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Item List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="rounded-2xl bg-surface border border-border p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="flex items-center gap-2 text-text-primary">
                  <Truck className="w-4 h-4 text-gold" />
                  {amountNeededForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-gold">{formatPKR(amountNeededForFreeShipping)}</strong> more to unlock <strong>FREE Express Shipping</strong>!
                    </span>
                  ) : (
                    <span className="text-status-success font-bold">You qualify for FREE Nationwide Delivery!</span>
                  )}
                </span>
                <span className="text-text-muted">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-elevated h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="rounded-2xl bg-surface border border-border divide-y divide-border overflow-hidden shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="relative w-20 h-20 rounded-xl bg-elevated overflow-hidden shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-text-primary">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted hover:text-status-danger p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant_title && (
                      <p className="text-xs text-text-muted">{item.variant_title}</p>
                    )}

                    {/* Customization Details */}
                    {item.customization_data && Object.keys(item.customization_data).length > 0 && (
                      <div className="rounded-lg bg-elevated/70 px-3 py-1.5 text-xs text-text-secondary border border-border/50 max-w-md space-y-0.5 mt-1">
                        {item.customization_data.name_text && (
                          <div>
                            <span className="font-semibold text-gold">Custom Text:</span> &quot;{item.customization_data.name_text}&quot;
                          </div>
                        )}
                        {item.customization_data.font_choice && (
                          <div>
                            <span className="font-semibold">Font:</span> {item.customization_data.font_choice}
                          </div>
                        )}
                        {item.customization_data.text_color && (
                          <div>
                            <span className="font-semibold">Color:</span> {item.customization_data.text_color}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between sm:justify-start sm:gap-6">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.id, q)}
                        size="sm"
                      />
                      <span className="font-serif font-bold text-gold text-base">
                        {formatPKR(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
              <h2 className="font-serif font-bold text-base text-text-primary border-b border-border pb-3">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold/15 border border-gold/40 text-xs">
                    <div className="flex items-center gap-1.5 text-gold font-semibold">
                      <Tag className="w-4 h-4" />
                      <span>Coupon &quot;{appliedCoupon.code}&quot; applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-text-muted hover:text-status-danger underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <Input
                      placeholder="Discount code (e.g. MW10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="h-10 text-xs"
                    />
                    <Button type="submit" variant="outline" size="sm" className="h-10 shrink-0">
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Gift Wrap */}
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
                    <Gift className="w-4 h-4 text-gold" />
                    <span>Luxury Gift Wrap (+Rs. 150)</span>
                  </label>
                  <Checkbox
                    checked={isGiftWrapped}
                    onChange={(e) => setIsGiftWrapped(e.target.checked)}
                  />
                </div>

                {isGiftWrapped && (
                  <Textarea
                    placeholder="Enter greeting message for the card..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    charLimit={150}
                    className="text-xs"
                  />
                )}
              </div>

              {/* Subtotal breakdown */}
              <div className="pt-2 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-primary">{formatPKR(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-status-success font-medium">
                    <span>Discount</span>
                    <span>-{formatPKR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-text-secondary">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-status-success">FREE</strong> : formatPKR(shippingFee)}</span>
                </div>

                {giftWrapFee > 0 && (
                  <div className="flex justify-between text-text-secondary">
                    <span>Gift Wrap</span>
                    <span>{formatPKR(giftWrapFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-text-primary pt-3 border-t border-border">
                  <span>Total (PKR)</span>
                  <span className="font-serif text-gold text-lg">{formatPKR(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block w-full pt-2">
                <Button variant="gold" size="lg" className="w-full gap-2 uppercase tracking-wider font-extrabold text-xs sm:text-sm">
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Cash on Delivery &amp; Manual Verification Safe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
