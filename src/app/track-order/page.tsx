'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import { Order, OrderStatus } from '@/types';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import { formatPKR, formatDate } from '@/lib/utils';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = React.useState(initialOrderNumber);
  const [phoneNumber, setPhoneNumber] = React.useState(initialPhone);
  const [searchedOrder, setSearchedOrder] = React.useState<Order | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const performLookup = React.useCallback((num: string, ph: string) => {
    setHasSearched(true);
    setErrorMessage('');

    const cleanNum = num.trim().toUpperCase();
    const cleanPh = ph.trim().replace(/[\s-]/g, '');

    // Search local storage first
    let foundOrder: any = null;
    try {
      const storedStr = localStorage.getItem('mw_trends_customer_orders');
      if (storedStr) {
        const stored = JSON.parse(storedStr);
        foundOrder = stored.find(
          (o: any) =>
            o.order_number.toUpperCase() === cleanNum ||
            (cleanPh && o.customer_phone.includes(cleanPh))
        );
      }
    } catch {
      // ignore
    }

    if (foundOrder) {
      setSearchedOrder(foundOrder);
    } else {
      setSearchedOrder(null);
      setErrorMessage(`No order found matching "${num}". Please double check your order number.`);
    }
  }, []);

  // Auto-lookup if query params exist
  React.useEffect(() => {
    if (initialOrderNumber) {
      performLookup(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone, performLookup]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setErrorMessage('Please enter your Order Number (e.g. MW-001041).');
      return;
    }
    performLookup(orderNumber, phoneNumber);
  };

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'New', label: 'Order Placed' },
    { key: 'Confirmed', label: 'Confirmed' },
    { key: 'In Production', label: 'In Production' },
    { key: 'Shipped', label: 'Shipped / In Transit' },
    { key: 'Delivered', label: 'Delivered' },
  ];

  const currentStep = searchedOrder ? ORDER_STATUS_CONFIG[searchedOrder.status]?.step || 1 : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-8">
      <Breadcrumb items={[{ label: 'Track Order' }]} />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
          Live Order Tracking
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Track the real-time production and courier status of your personalized MW Trends order.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="rounded-2xl bg-surface border border-border p-6 shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div>
            <Input
              label="Order Reference Number"
              placeholder="e.g. MW-001041"
              value={orderNumber}
              required
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          <div>
            <Input
              label="Mobile Phone Number (Optional)"
              placeholder="e.g. 03001234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <Button variant="gold" size="md" type="submit" className="w-full gap-2 font-bold uppercase tracking-wider text-xs">
            <Search className="w-4 h-4" />
            <span>Track Order Status</span>
          </Button>

          {/* Quick demo helper button for testing */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setOrderNumber('MW-001041');
                setPhoneNumber('03001234567');
                performLookup('MW-001041', '03001234567');
              }}
              className="text-[11px] text-gold hover:underline"
            >
              (Test with Sample Demo Order: MW-001041)
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger max-w-xl mx-auto flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Results Display */}
      {searchedOrder && (
        <div className="rounded-3xl bg-surface border border-border p-6 sm:p-8 space-y-8 shadow-md animate-in fade-in-50 duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs text-text-muted">Order Number</span>
              <h2 className="font-mono text-2xl font-black text-gold">
                {searchedOrder.order_number}
              </h2>
              <span className="text-xs text-text-muted">
                Placed on {formatDate(searchedOrder.created_at)}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-text-muted block">Current Status</span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  ORDER_STATUS_CONFIG[searchedOrder.status]?.bg || 'bg-elevated'
                } ${ORDER_STATUS_CONFIG[searchedOrder.status]?.color || 'text-text-primary'}`}
              >
                <span>{ORDER_STATUS_CONFIG[searchedOrder.status]?.label || searchedOrder.status}</span>
              </div>
            </div>
          </div>

          {/* Timeline Visual Stepper */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-text-primary">
              Fulfillment Journey
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-elevated -z-0 hidden sm:block">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{
                    width: `${((Math.max(1, currentStep) - 1) / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((st, idx) => {
                  const stepNumber = idx + 1;
                  const isCompleted = currentStep >= stepNumber;
                  const isCurrent = currentStep === stepNumber;

                  return (
                    <div
                      key={st.key}
                      className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                          isCompleted
                            ? 'bg-gold text-black shadow-gold-glow'
                            : 'bg-elevated text-text-muted border border-border'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : stepNumber}
                      </div>

                      <div className="text-left sm:text-center">
                        <span
                          className={`text-xs block font-semibold ${
                            isCurrent
                              ? 'text-gold'
                              : isCompleted
                              ? 'text-text-primary'
                              : 'text-text-muted'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-text-secondary bg-elevated/40 p-3 rounded-xl border border-border mt-4">
              {ORDER_STATUS_CONFIG[searchedOrder.status]?.description}
            </p>
          </div>

          {/* Courier Information (If Shipped) */}
          {searchedOrder.courier_name && (
            <div className="rounded-2xl bg-gold/10 border border-gold/30 p-5 space-y-3">
              <div className="flex items-center gap-2 text-gold font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>Courier Dispatch Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-text-muted block">Partner</span>
                  <strong className="text-text-primary text-sm">{searchedOrder.courier_name}</strong>
                </div>

                <div>
                  <span className="text-text-muted block">Tracking Number</span>
                  <span className="font-mono text-gold font-bold text-sm">
                    {searchedOrder.tracking_number}
                  </span>
                </div>

                {searchedOrder.tracking_url && (
                  <div className="flex items-end">
                    <a
                      href={searchedOrder.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
                    >
                      <span>Track on {searchedOrder.courier_name} Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items Table */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="font-serif font-bold text-sm text-text-primary">
              Personalized Order Items
            </h4>

            <div className="divide-y divide-border">
              {searchedOrder.items?.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-text-primary text-sm block">{it.product_title}</strong>
                    {it.variant_title && (
                      <span className="text-text-muted block">{it.variant_title}</span>
                    )}
                    {it.customization_data?.name_text && (
                      <span className="text-[11px] text-gold block mt-0.5">
                        Personalized Text: &quot;{it.customization_data.name_text}&quot; ({it.customization_data.font_choice || 'Standard'})
                      </span>
                    )}
                    <span className="text-text-muted">Quantity: {it.quantity}</span>
                  </div>

                  <span className="font-serif font-bold text-gold text-sm">
                    {formatPKR(it.line_total)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold">
              <span>Total Amount</span>
              <span className="font-serif text-gold text-lg">{formatPKR(searchedOrder.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-text-muted">
          Loading order tracking portal...
        </div>
      }
    >
      <TrackOrderContent />
    </React.Suspense>
  );
}
