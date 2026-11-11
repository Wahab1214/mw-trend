'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useToast } from '@/components/ui/toast';
import { formatPKR, isValidPakistanPhone, generateOrderNumber } from '@/lib/utils';
import { PAKISTAN_MAJOR_CITIES, PAYMENT_METHOD_CONFIG } from '@/lib/constants';
import { PaymentMethod } from '@/types';
import { getPaymentAdapter } from '@/lib/payments/adapter';
import { useCatalog } from '@/lib/store/catalog-context';
import { createOrderApi, uploadImageToCloud } from '@/lib/catalog-client';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  UploadCloud,
  AlertTriangle,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    giftWrapFee,
    total,
    appliedCoupon,
    isGiftWrapped,
    giftMessage,
    clearCart,
    availablePaymentMethods,
  } = useCart();

  // Form Fields
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [shippingCity, setShippingCity] = React.useState<string>(PAKISTAN_MAJOR_CITIES[0]);
  const [customCity, setCustomCity] = React.useState('');
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [orderNotes, setOrderNotes] = React.useState('');
  const [agreedTerms, setAgreedTerms] = React.useState(true);

  // Payment Selection
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>(
    availablePaymentMethods.includes('COD') ? 'COD' : availablePaymentMethods[0] || 'JazzCash'
  );

  // Manual payment proof fields
  const [transactionId, setTransactionId] = React.useState('');
  const [senderAccountName, setSenderAccountName] = React.useState('');
  const [uploadedProofPreview, setUploadedProofPreview] = React.useState<string | null>(null);

  const { settings: storeSettings } = useCatalog();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // If cart is empty, redirect to shop
  React.useEffect(() => {
    if (items.length === 0) {
      router.push('/shop');
    }
  }, [items, router]);

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    try {
      const url = await uploadImageToCloud(file, 'payment-proofs');
      setUploadedProofPreview(url);
      toast.success('Payment receipt screenshot uploaded!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload receipt.');
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Full Name is required.';
    }

    if (!customerPhone.trim()) {
      errs.customerPhone = 'Mobile Phone is required.';
    } else if (!isValidPakistanPhone(customerPhone)) {
      errs.customerPhone = 'Enter a valid Pakistan phone (e.g. 03001234567 or +923001234567).';
    }

    if (!shippingAddress.trim()) {
      errs.shippingAddress = 'Complete delivery street address is required.';
    }

    if (shippingCity === 'Other / Remote City' && !customCity.trim()) {
      errs.customCity = 'Please specify your city or town name.';
    }

    if (selectedMethod !== 'COD' && selectedMethod !== 'Card') {
      if (!transactionId.trim()) {
        errs.transactionId = 'Transaction Reference ID (TID) is required for manual verification.';
      }
    }

    if (!agreedTerms) {
      errs.agreedTerms = 'You must agree to the Terms & Delivery Policy to proceed.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please check required fields marked in red.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const finalCity = shippingCity === 'Other / Remote City' ? customCity : shippingCity;

      // Execute Pluggable Payment Adapter
      const adapter = getPaymentAdapter(selectedMethod);
      const paymentResult = await adapter.processPayment({
        orderNumber,
        amount: total,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod: selectedMethod,
        transactionId,
        proofImageUrl: uploadedProofPreview || undefined,
        senderAccountName,
      });

      if (!paymentResult.success) {
        toast.error(paymentResult.message, 'Payment Error');
        setIsSubmitting(false);
        return;
      }

      // Persist order to cloud database (Supabase) via /api/orders
      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        shipping_city: finalCity,
        order_notes: orderNotes,
        order_source: 'Website',
        subtotal,
        discount_amount: discountAmount,
        coupon_code: appliedCoupon?.code,
        shipping_fee: shippingFee,
        gift_wrap_fee: giftWrapFee,
        gift_message: giftMessage,
        total_amount: total,
        currency: 'PKR',
        total_cost_price: items.reduce((acc, i) => acc + i.unit_cost * i.quantity, 0),
        courier_cost: 180,
        packaging_ad_expense: 100,
        net_profit:
          total - (items.reduce((acc, i) => acc + i.unit_cost * i.quantity, 0) + 180 + 100),
        profit_margin_percent: 45,
        status: 'New',
        payment_method: selectedMethod,
        payment_status: selectedMethod === 'COD' ? 'pending' : 'pending_review',
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_title: item.title,
          variant_title: item.variant_title,
          sku: item.sku,
          product_image: item.image_url,
          unit_price: item.unit_price,
          unit_cost: item.unit_cost,
          quantity: item.quantity,
          line_total: item.unit_price * item.quantity,
          customization_data: item.customization_data,
        })),
        payment_proof: transactionId
          ? {
              payment_method: selectedMethod,
              transaction_id: transactionId,
              sender_account_name: senderAccountName,
              amount_paid: total,
              status: 'pending_review',
              proof_image_url: uploadedProofPreview,
            }
          : undefined,
      };

      const savedOrder = await createOrderApi(orderPayload);

      // Clear Cart
      clearCart();

      toast.success(`Order ${savedOrder.order_number || orderNumber} placed successfully!`, 'Order Confirmed');

      // Navigate to Order Success page
      router.push(`/order-success/${savedOrder.order_number || orderNumber}`);
    } catch (err: any) {
      toast.error(err?.message || 'An unexpected error occurred while placing order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none space-y-8">
      <Breadcrumb
        items={[
          { label: 'Bag', href: '/cart' },
          { label: 'Secure Checkout' },
        ]}
      />

      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Customer & Shipping Details + Payment Choice */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact & Delivery Address */}
          <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-5 shadow-sm">
            <h2 className="font-serif font-bold text-lg text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <Truck className="w-5 h-5 text-gold" />
              <span>1. Contact &amp; Shipping Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  placeholder="e.g. Muhammad Zaid"
                  value={customerName}
                  required
                  error={errors.customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Mobile Phone (WhatsApp)"
                  placeholder="03001234567"
                  value={customerPhone}
                  required
                  error={errors.customerPhone}
                  helperText="Courier will call before delivery."
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div>
                <Input
                  type="email"
                  label="Email Address (Optional)"
                  placeholder="yourname@gmail.com"
                  value={customerEmail}
                  helperText="For digital receipt and tracking alerts."
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Select
                  label="Destination City"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  options={PAKISTAN_MAJOR_CITIES.map((city) => ({ value: city, label: city }))}
                />
              </div>

              {shippingCity === 'Other / Remote City' && (
                <div className="sm:col-span-2 animate-in fade-in-50 duration-200">
                  <Input
                    label="Specify Your City / Town"
                    placeholder="Enter city or district name"
                    value={customCity}
                    required
                    error={errors.customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <Textarea
                  label="Street Address & Nearest Landmark"
                  placeholder="House / Apartment number, Street name, Sector / Mohalla, Landmark (e.g. Near Shell pump)"
                  value={shippingAddress}
                  required
                  error={errors.shippingAddress}
                  charLimit={250}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Delivery Instructions / Notes (Optional)"
                  placeholder="e.g. Ring bell twice, deliver after 2 PM"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-5 shadow-sm">
            <h2 className="font-serif font-bold text-lg text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <Banknote className="w-5 h-5 text-gold" />
              <span>2. Select Payment Method</span>
            </h2>

            {/* Incompatible payment method conflict check */}
            {availablePaymentMethods.length === 0 ? (
              <div className="p-4 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Payment Method Conflict</strong>
                  <p>The items in your bag have incompatible accepted payment methods. Please separate them into two different orders.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {availablePaymentMethods.map((method) => {
                  const cfg = PAYMENT_METHOD_CONFIG[method];
                  const isSelected = selectedMethod === method;

                  return (
                    <label
                      key={method}
                      onClick={() => setSelectedMethod(method)}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-sm'
                          : 'border-border bg-surface hover:border-gold/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={isSelected}
                        onChange={() => setSelectedMethod(method)}
                        className="mt-1 text-gold focus:ring-gold"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-text-primary">
                            {cfg.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-elevated text-gold border border-gold/30">
                            {cfg.badge}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{cfg.subtitle}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Manual Verification Details Box (JazzCash, Easypaisa, Bank Transfer) */}
            {(selectedMethod === 'JazzCash' || selectedMethod === 'Easypaisa' || selectedMethod === 'BankTransfer') && (
              <div className="rounded-xl border border-gold/40 bg-elevated/60 p-4 space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-2 text-gold font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Manual Payment Account Credentials:</span>
                </div>

                {selectedMethod === 'JazzCash' && (
                  <div className="text-xs space-y-1 bg-surface p-3 rounded-lg border border-border">
                    <p><strong>Account Title:</strong> {storeSettings.payment_accounts.jazzcash?.title || 'MW Trends'}</p>
                    <p><strong>Account / Mobile:</strong> <span className="font-mono text-gold font-bold">{storeSettings.payment_accounts.jazzcash?.number || 'Contact on WhatsApp'}</span></p>
                    {storeSettings.payment_accounts.jazzcash?.till_id && (
                      <p><strong>Till ID:</strong> <span className="font-mono font-bold">{storeSettings.payment_accounts.jazzcash?.till_id}</span></p>
                    )}
                    <p className="text-text-muted text-[11px] pt-1">{storeSettings.payment_accounts.jazzcash?.instructions}</p>
                  </div>
                )}

                {selectedMethod === 'Easypaisa' && (
                  <div className="text-xs space-y-1 bg-surface p-3 rounded-lg border border-border">
                    <p><strong>Account Title:</strong> {storeSettings.payment_accounts.easypaisa?.title || 'MW Trends'}</p>
                    <p><strong>Easypaisa Mobile:</strong> <span className="font-mono text-gold font-bold">{storeSettings.payment_accounts.easypaisa?.number || 'Contact on WhatsApp'}</span></p>
                    <p className="text-text-muted text-[11px] pt-1">{storeSettings.payment_accounts.easypaisa?.instructions}</p>
                  </div>
                )}

                {selectedMethod === 'BankTransfer' && (
                  <div className="text-xs space-y-1 bg-surface p-3 rounded-lg border border-border">
                    <p><strong>Bank Name:</strong> {storeSettings.payment_accounts.bank?.bank_name || 'Meezan Bank'}</p>
                    <p><strong>Account Title:</strong> {storeSettings.payment_accounts.bank?.account_title || 'MW Trends'}</p>
                    <p><strong>Account Number:</strong> <span className="font-mono font-bold">{storeSettings.payment_accounts.bank?.account_number || '02000000000000'}</span></p>
                    {storeSettings.payment_accounts.bank?.iban && (
                      <p><strong>IBAN:</strong> <span className="font-mono text-gold font-bold">{storeSettings.payment_accounts.bank?.iban}</span></p>
                    )}
                    <p><strong>Branch:</strong> {storeSettings.payment_accounts.bank?.branch || 'Lahore'}</p>
                    <p className="text-text-muted text-[11px] pt-1">{storeSettings.payment_accounts.bank?.instructions}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <Input
                      label="Transaction ID (TID / Ref #)"
                      placeholder="e.g. 0123456789"
                      value={transactionId}
                      required
                      error={errors.transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label="Sender Account Name"
                      placeholder="e.g. Muhammad Zaid"
                      value={senderAccountName}
                      onChange={(e) => setSenderAccountName(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-text-secondary uppercase block">
                      Attach Payment Screenshot (Optional but speeds verification)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text-primary hover:border-gold cursor-pointer transition-colors">
                        <UploadCloud className="w-4 h-4 text-gold" />
                        <span>Choose Receipt Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProofUpload}
                          className="sr-only"
                        />
                      </label>
                      {uploadedProofPreview && (
                        <div className="flex items-center gap-1.5 text-xs text-status-success font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Receipt Attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Policy Checkbox */}
            <div className="pt-3 border-t border-border">
              <Checkbox
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                label={
                  <span className="text-xs text-text-secondary">
                    I agree to the <Link href="/terms" className="text-gold underline">Terms of Service</Link> and understand personalized print-on-demand items cannot be cancelled once crafting begins.
                  </span>
                }
              />
              {errors.agreedTerms && (
                <p className="text-xs text-status-danger font-medium mt-1">{errors.agreedTerms}</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Review & Submit Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-5 shadow-sm sticky top-24">
            <h2 className="font-serif font-bold text-base text-text-primary border-b border-border pb-3">
              Order Review ({items.length} Items)
            </h2>

            {/* Items summary */}
            <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-elevated overflow-hidden shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-text-primary truncate">{item.title}</h4>
                    <p className="text-[11px] text-text-muted">Qty: {item.quantity}</p>
                    {item.customization_data?.name_text && (
                      <p className="text-[10px] text-gold truncate">Custom: &quot;{item.customization_data.name_text}&quot;</p>
                    )}
                  </div>
                  <span className="font-serif font-bold text-xs text-gold">
                    {formatPKR(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="pt-2 border-t border-border space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary">{formatPKR(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-status-success font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPKR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-text-secondary">
                <span>Nationwide Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-status-success">FREE</strong> : formatPKR(shippingFee)}</span>
              </div>

              {giftWrapFee > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Gift Wrapping</span>
                  <span>{formatPKR(giftWrapFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-text-primary pt-3 border-t border-border">
                <span>Total Amount Due</span>
                <span className="font-serif text-gold text-xl">{formatPKR(total)}</span>
              </div>
            </div>

            {/* Final Place Order CTA */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting || availablePaymentMethods.length === 0}
              className="w-full uppercase tracking-wider font-extrabold text-sm shadow-gold-glow py-4 h-12"
            >
              <span>Confirm &amp; Place Order</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="space-y-1 text-center text-[11px] text-text-muted pt-1">
              <p>Estimated Delivery: 24 - 48 Hours Across Pakistan</p>
              <p>Confirmation SMS &amp; WhatsApp update will be sent.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
