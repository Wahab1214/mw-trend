'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate, calculateOrderProfit } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, COURIER_PARTNERS } from '@/lib/constants';
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  Truck,
  CheckCircle2,
  XCircle,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Layers,
  FileText,
  Eye
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const toast = useToast();

  const [order, setOrder] = React.useState<Order>(() => {
    // Check localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mw_trends_customer_orders');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((o: any) => o.id === orderId);
          if (found) return found;
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_ORDERS.find((o) => o.id === orderId) || INITIAL_ORDERS[0];
  });

  const [currentStatus, setCurrentStatus] = React.useState<OrderStatus>(order.status);
  const [courierName, setCourierName] = React.useState(order.courier_name || COURIER_PARTNERS[0].name);
  const [trackingNumber, setTrackingNumber] = React.useState(order.tracking_number || '');
  const [courierCost, setCourierCost] = React.useState<number>(order.courier_cost || 180);
  const [adPackingCost, setAdPackingCost] = React.useState<number>(order.packaging_ad_expense || 100);
  const [isProofModalOpen, setIsProofModalOpen] = React.useState(false);
  const [paymentVerified, setPaymentVerified] = React.useState(
    order.payment_status === 'verified' || order.payment_status === 'paid'
  );

  // Profit calculation
  const totalCost = order.items?.reduce((acc, it) => acc + (it.unit_cost * it.quantity), 0) || order.total_cost_price;
  const profitMetrics = calculateOrderProfit(
    order.subtotal,
    order.discount_amount,
    order.shipping_fee,
    totalCost,
    courierCost,
    adPackingCost
  );

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    setOrder((prev) => ({ ...prev, status: newStatus }));
    toast.success(`Order status changed to "${newStatus}" and audit log recorded.`);
  };

  const handleSaveDispatch = () => {
    const selectedPartner = COURIER_PARTNERS.find((c) => c.name === courierName);
    const trackingUrl = selectedPartner ? `${selectedPartner.trackingUrl}${trackingNumber}` : '';

    setOrder((prev) => ({
      ...prev,
      courier_name: courierName,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      status: 'Shipped',
    }));
    setCurrentStatus('Shipped');
    toast.success(`Order dispatched via ${courierName}! Tracking number: ${trackingNumber}`);
  };

  const handleApprovePayment = () => {
    setPaymentVerified(true);
    setOrder((prev) => ({
      ...prev,
      payment_status: 'verified',
      payment_proof: prev.payment_proof
        ? { ...prev.payment_proof, status: 'approved' }
        : undefined,
    }));
    setIsProofModalOpen(false);
    toast.success('Payment proof verified and approved!');
  };

  const handleRejectPayment = () => {
    setPaymentVerified(false);
    setOrder((prev) => ({
      ...prev,
      payment_status: 'failed',
      payment_proof: prev.payment_proof
        ? { ...prev.payment_proof, status: 'rejected' }
        : undefined,
    }));
    setIsProofModalOpen(false);
    toast.error('Payment proof rejected. Notification sent to customer.');
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${order.customer_name}! Your MW Trends order #${order.order_number} status is now: ${currentStatus}. ${
      order.tracking_number ? `Courier: ${order.courier_name}, Tracking #: ${order.tracking_number}` : ''
    }`
  );
  const whatsappUrl = `https://wa.me/${order.customer_phone.replace(/[\s-]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none pb-12">
      {/* Top Bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 no-print">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-2xl font-black text-gold">
                {order.order_number}
              </h1>
              <Badge variant={currentStatus === 'Delivered' || currentStatus === 'Shipped' ? 'success' : 'gold'}>
                {currentStatus}
              </Badge>
            </div>
            <p className="text-xs text-text-muted">
              Placed on {formatDate(order.created_at)} • Source: <strong className="text-text-primary">{order.order_source || 'Website'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5 text-gold" />
            <span>Print Invoice / Slip</span>
          </Button>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Customer</span>
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Items, Customization Details & Printable Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items & Custom Text for Printing */}
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-3 flex items-center justify-between">
              <span>Personalized Order Inscription Details</span>
              <span className="text-xs text-gold font-normal">Print-Ready Specifications</span>
            </h3>

            <div className="divide-y divide-border">
              {order.items?.map((it) => (
                <div key={it.id} className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-bold text-text-primary block">
                        {it.product_title}
                      </strong>
                      {it.variant_title && (
                        <span className="text-xs text-text-muted block">{it.variant_title}</span>
                      )}
                      <span className="text-xs text-text-muted">SKU: {it.sku || 'N/A'}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-text-primary text-sm block">
                        {formatPKR(it.line_total)}
                      </span>
                      <span className="text-xs text-text-muted">Qty: {it.quantity} × {formatPKR(it.unit_price)}</span>
                    </div>
                  </div>

                  {/* Highlighting Custom Text For Staff / Production Print */}
                  {it.customization_data && Object.keys(it.customization_data).length > 0 && (
                    <div className="rounded-xl bg-gold/10 border border-gold/40 p-4 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-gold uppercase tracking-wider text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Exact Inscription To Print / Laser Etch:</span>
                      </div>

                      {it.customization_data.name_text && (
                        <div className="text-sm">
                          <span className="text-text-muted">Custom Name / Text:</span>{' '}
                          <span className="font-mono font-black text-text-primary bg-surface px-2 py-0.5 rounded border border-border text-base">
                            {it.customization_data.name_text}
                          </span>
                        </div>
                      )}

                      {it.customization_data.font_choice && (
                        <div>
                          <span className="text-text-muted">Font Family:</span>{' '}
                          <strong className="text-text-primary">{it.customization_data.font_choice}</strong>
                        </div>
                      )}

                      {it.customization_data.text_color && (
                        <div>
                          <span className="text-text-muted">Foil / Color:</span>{' '}
                          <strong className="text-text-primary">{it.customization_data.text_color}</strong>
                        </div>
                      )}

                      {it.customization_data.message_text && (
                        <div className="pt-1">
                          <span className="text-text-muted block">Inner Greeting Note:</span>
                          <blockquote className="italic border-l-2 border-gold pl-2 text-text-primary bg-surface/50 p-2 rounded">
                            &quot;{it.customization_data.message_text}&quot;
                          </blockquote>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gift wrap note if present */}
            {order.gift_wrap_fee > 0 && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-700 dark:text-purple-300">
                <strong>Luxury Gift Wrapping Requested (+Rs. 150)</strong>
                {order.gift_message && (
                  <p className="mt-1 italic">&quot;{order.gift_message}&quot;</p>
                )}
              </div>
            )}
          </div>

          {/* Customer Destination Info */}
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-3">
              Delivery Address &amp; Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Recipient Name</span>
                <strong className="text-text-primary text-sm font-semibold">{order.customer_name}</strong>
              </div>

              <div>
                <span className="text-text-muted block">Mobile Phone</span>
                <strong className="text-text-primary text-sm font-mono">{order.customer_phone}</strong>
              </div>

              <div>
                <span className="text-text-muted block">Destination City</span>
                <span className="text-text-primary font-semibold">{order.shipping_city}</span>
              </div>

              <div>
                <span className="text-text-muted block">Customer Email</span>
                <span className="text-text-primary">{order.customer_email || 'Not provided'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-text-muted block">Complete Street Address</span>
                <p className="text-text-primary font-medium bg-elevated/50 p-2.5 rounded-lg border border-border mt-1">
                  {order.shipping_address}
                </p>
              </div>

              {order.order_notes && (
                <div className="sm:col-span-2">
                  <span className="text-text-muted block">Order Instructions:</span>
                  <p className="italic text-text-secondary mt-0.5">{order.order_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Status changer, Courier Dispatch, Profit Calculator & Payment Review */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {/* Status Changer */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Update Order Status
            </h3>

            <Select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              options={[
                { value: 'New', label: 'New / Unconfirmed' },
                { value: 'Confirmed', label: 'Confirmed (Payment Verified)' },
                { value: 'In Production', label: 'In Production (Printing)' },
                { value: 'Shipped', label: 'Shipped (Handed to Courier)' },
                { value: 'Delivered', label: 'Delivered' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'Returned', label: 'Returned' },
              ]}
            />
          </div>

          {/* Payment Proof Verification */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-serif font-bold text-base text-text-primary">
                Payment Verification
              </h3>
              <Badge variant={paymentVerified ? 'success' : 'warning'}>
                {paymentVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>

            <div className="text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-text-muted">Method:</span>
                <strong className="text-text-primary">{order.payment_method}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Amount Due:</span>
                <strong className="font-serif text-gold">{formatPKR(order.total_amount)}</strong>
              </div>
              {order.payment_proof?.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Customer TID:</span>
                  <span className="font-mono font-bold text-text-primary">{order.payment_proof.transaction_id}</span>
                </div>
              )}
            </div>

            {order.payment_method !== 'COD' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProofModalOpen(true)}
                className="w-full text-xs font-semibold gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-gold" />
                <span>Inspect Receipt Screenshot</span>
              </Button>
            )}
          </div>

          {/* Courier Dispatch Assignment */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold" />
              <span>Courier Booking</span>
            </h3>

            <div className="space-y-3">
              <Select
                label="Partner Courier"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                options={COURIER_PARTNERS.map((c) => ({ value: c.name, label: c.name }))}
              />

              <Input
                label="Tracking Number / CN #"
                placeholder="e.g. TCS99008811"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />

              <Button
                variant="gold"
                size="sm"
                onClick={handleSaveDispatch}
                disabled={!trackingNumber.trim()}
                className="w-full uppercase font-bold text-xs"
              >
                Mark Dispatched &amp; Send Tracking
              </Button>
            </div>
          </div>

          {/* Auto Profit & Margin Per-Order Calculator */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3 shadow-sm text-xs">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Order Profitability Metrics</span>
            </h3>

            <div className="flex justify-between text-text-secondary">
              <span>Customer Revenue:</span>
              <strong className="text-text-primary">{formatPKR(profitMetrics.netRevenue)}</strong>
            </div>

            <div className="flex justify-between text-text-secondary">
              <span>Item Cost of Goods:</span>
              <span className="text-text-muted">-{formatPKR(totalCost)}</span>
            </div>

            <div className="flex justify-between text-text-secondary">
              <span>Courier Shipping Expense:</span>
              <span className="text-text-muted">-{formatPKR(courierCost)}</span>
            </div>

            <div className="flex justify-between text-text-secondary">
              <span>Packaging &amp; Ad Expense:</span>
              <span className="text-text-muted">-{formatPKR(adPackingCost)}</span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center text-sm font-bold">
              <span>Net Order Profit:</span>
              <span className="font-serif text-emerald-500 text-base">{formatPKR(profitMetrics.netProfit)}</span>
            </div>

            <div className="text-right text-[11px] text-text-muted">
              Margin: <strong className="text-text-primary font-bold">{profitMetrics.marginPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proof Modal */}
      <Modal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        title="Inspect Payment Transfer Proof"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-elevated/60 border border-border space-y-1">
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Transaction ID (TID):</strong> <span className="font-mono text-gold font-bold">{order.payment_proof?.transaction_id || 'N/A'}</span></p>
            <p><strong>Sender Account:</strong> {order.payment_proof?.sender_account_name || 'N/A'}</p>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border">
            {order.payment_proof?.proof_image_url ? (
              <Image
                src={order.payment_proof.proof_image_url}
                alt="Receipt Proof"
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No screenshot uploaded. Verified via Transaction ID.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="danger" size="sm" onClick={handleRejectPayment}>
              Reject Payment
            </Button>
            <Button variant="primary" size="sm" onClick={handleApprovePayment}>
              Approve &amp; Verify Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
