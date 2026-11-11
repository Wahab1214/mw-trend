'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight, Sparkles } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import { trackOrderApi } from '@/lib/catalog-client';
import { useCatalog } from '@/lib/store/catalog-context';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = (params?.orderNumber as string) || 'MW-10024';
  const { settings } = useCatalog();
  const [orderData, setOrderData] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A44C', '#E3C877', '#9A7B2F', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    trackOrderApi(orderNumber)
      .then((found) => {
        if (found) setOrderData(found);
      })
      .catch(() => {});
  }, [orderNumber]);

  const cleanWa = (settings?.whatsapp_number || '923370566870').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum MW Trends! I just placed order #${orderNumber}. Please confirm my order details.`
  );
  const whatsappUrl = `https://wa.me/${cleanWa}?text=${whatsappMessage}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 select-none space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-500 shadow-lg animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Your personalized keepsake is now queued for crafting in our Lahore studio.
          </p>
        </div>

        {/* Order Number Badge */}
        <div className="inline-block bg-surface border border-gold/40 rounded-2xl px-6 py-3 shadow-sm">
          <span className="text-xs text-text-muted block">Your Tracking Order Reference</span>
          <span className="font-mono text-2xl font-black text-gold tracking-wider">
            {orderNumber}
          </span>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-2xl bg-surface border border-border p-6 space-y-6 shadow-sm">
        <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-3">
          Order Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-text-muted block">Recipient Name</span>
            <strong className="text-text-primary text-sm font-semibold">
              {orderData?.customer_name || 'Valued Customer'}
            </strong>
          </div>

          <div className="space-y-1">
            <span className="text-text-muted block">Delivery Address</span>
            <span className="text-text-secondary block">
              {orderData?.shipping_address || 'Pakistan Express Address'}, {orderData?.shipping_city || 'Pakistan'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-text-muted block">Payment Method</span>
            <span className="text-text-secondary font-medium">
              {orderData?.payment_method === 'COD' ? 'Cash on Delivery (Pay at Doorstep)' : orderData?.payment_method || 'Cash on Delivery'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-text-muted block">Estimated Dispatch</span>
            <span className="text-gold font-semibold">Within 24 - 48 Hours</span>
          </div>
        </div>

        {/* Items Summary if found */}
        {orderData?.items && (
          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Personalized Items ({orderData.items.length})
            </h4>
            <div className="divide-y divide-border/60">
              {orderData.items.map((it: any) => (
                <div key={it.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-text-primary block">{it.product_title}</span>
                    {it.customization_data?.name_text && (
                      <span className="text-[11px] text-gold">
                        Custom Text: &quot;{it.customization_data.name_text}&quot;
                      </span>
                    )}
                  </div>
                  <span className="font-serif font-bold text-text-primary">
                    {formatPKR(it.line_total)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 font-bold text-sm">
              <span>Total Paid / Due</span>
              <span className="font-serif text-gold text-base">{formatPKR(orderData.total_amount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm via WhatsApp Desk</span>
          </Button>
        </a>

        <Link
          href={`/track-order?orderNumber=${orderNumber}&phone=${orderData?.customer_phone || ''}`}
          className="w-full sm:w-auto"
        >
          <Button
            variant="gold"
            size="lg"
            className="w-full sm:w-auto gap-2 text-xs uppercase tracking-wider font-bold"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Button>
        </Link>
      </div>

      <div className="text-center pt-4">
        <Link href="/shop" className="text-xs text-text-muted hover:text-gold transition-colors">
          &larr; Return to Storefront
        </Link>
      </div>
    </div>
  );
}
