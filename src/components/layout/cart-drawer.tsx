'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Drawer } from '@/components/ui/drawer';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Price } from '@/components/ui/price';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { formatPKR } from '@/lib/utils';
import { ShoppingBag, Trash2, Gift, Truck, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
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
  const [showGiftOptions, setShowGiftOptions] = React.useState(false);

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
    <Drawer isOpen={isOpen} onClose={closeCart} title="Your Shopping Bag" side="right">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center text-text-muted">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-lg font-bold text-text-primary">Your bag is empty</h4>
          <p className="text-xs text-text-secondary max-w-xs">
            Explore our curated personalized gifts, custom monogram mugs, and luxury engraved pens.
          </p>
          <Button
            variant="gold"
            size="md"
            onClick={closeCart}
            className="mt-4"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="rounded-xl bg-elevated p-3 border border-border">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-text-primary">
                <Truck className="w-4 h-4 text-gold" />
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    Add <strong className="text-gold">{formatPKR(amountNeededForFreeShipping)}</strong> more for <strong>FREE Express Delivery</strong>
                  </span>
                ) : (
                  <span className="text-status-success font-semibold">You unlocked FREE Express Delivery!</span>
                )}
              </span>
              <span className="text-text-muted">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border/40">
              <div
                className="bg-gold h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl border border-border bg-surface/70 hover:border-gold/30 transition-colors"
              >
                {/* Product Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg bg-elevated overflow-hidden shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-text-primary line-clamp-1">{item.title}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-text-muted hover:text-status-danger p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.variant_title && (
                    <p className="text-[11px] text-text-muted">{item.variant_title}</p>
                  )}

                  {/* Customization Summary */}
                  {item.customization_data && Object.keys(item.customization_data).length > 0 && (
                    <div className="rounded bg-elevated/80 px-2 py-1 text-[10px] text-text-secondary border border-border/40 space-y-0.5">
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

                  <div className="flex items-center justify-between pt-1">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, q)}
                    />
                    <div className="text-xs font-bold text-gold font-serif">
                      {formatPKR(item.unit_price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-2 border-t border-border">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-gold/10 border border-gold/30 text-xs">
                <div className="flex items-center gap-1.5 text-gold font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon &quot;{appliedCoupon.code}&quot; applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-text-muted hover:text-status-danger text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  placeholder="Coupon code (e.g. MW10)"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button type="submit" variant="outline" size="sm" className="h-9 shrink-0">
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Gift Wrap Toggle */}
          <div className="border-t border-border pt-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
                <Gift className="w-4 h-4 text-gold" />
                <span>Luxury Gift Wrapping (+Rs. 150)</span>
              </label>
              <Checkbox
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
              />
            </div>

            {isGiftWrapped && (
              <div className="animate-in fade-in-50 duration-200">
                <Textarea
                  placeholder="Write your custom gift message for the recipient..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  charLimit={150}
                  className="text-xs min-h-[60px]"
                />
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-border pt-3 space-y-1.5 text-xs">
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
                <span>Gift Wrapping</span>
                <span>{formatPKR(giftWrapFee)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-border/60">
              <span>Total (PKR)</span>
              <span className="font-serif text-gold text-base">{formatPKR(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-2 space-y-2">
            <Link href="/checkout" onClick={closeCart} className="block w-full">
              <Button variant="gold" size="lg" className="w-full gap-2 text-sm uppercase tracking-wider font-bold">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Cash on Delivery & Secure Bank / JazzCash Verification</span>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
