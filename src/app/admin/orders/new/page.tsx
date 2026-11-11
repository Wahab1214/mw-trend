'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { INITIAL_PRODUCTS } from '@/lib/mock-data';
import { createOrderApi, fetchCatalogData } from '@/lib/catalog-client';
import { PAKISTAN_MAJOR_CITIES } from '@/lib/constants';
import { generateOrderNumber, formatPKR } from '@/lib/utils';
import { Product } from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function NewManualOrderPage() {
  const router = useRouter();
  const toast = useToast();

  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [shippingCity, setShippingCity] = React.useState<string>(PAKISTAN_MAJOR_CITIES[0]);
  const [shippingAddress, setShippingAddress] = React.useState('');
  const [orderSource, setOrderSource] = React.useState('WhatsApp');
  const [paymentMethod, setPaymentMethod] = React.useState('COD');
  const [shippingFee, setShippingFee] = React.useState<number>(200);
  const [isSaving, setIsSaving] = React.useState(false);

  // Selected order items
  const [orderItems, setOrderItems] = React.useState<
    { productId: string; quantity: number; customText: string }[]
  >([{ productId: INITIAL_PRODUCTS[0]?.id || '', quantity: 1, customText: '' }]);

  React.useEffect(() => {
    fetchCatalogData(true)
      .then((res) => {
        if (res.products?.length) {
          setProducts(res.products);
          setOrderItems((prev) =>
            prev.map((item) =>
              item.productId ? item : { ...item, productId: res.products[0].id }
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleAddItem = () => {
    setOrderItems((prev) => [
      ...prev,
      { productId: products[0]?.id || '', quantity: 1, customText: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = orderItems.reduce((acc, it) => {
    const prod = products.find((p) => p.id === it.productId);
    const price = prod?.sale_price || prod?.regular_price || 0;
    return acc + price * it.quantity;
  }, 0);

  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      toast.error('Please enter customer name, phone, and complete delivery address.');
      return;
    }

    setIsSaving(true);
    try {
      const orderNumber = generateOrderNumber();
      const created = await createOrderApi({
        order_number: orderNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        shipping_city: shippingCity,
        shipping_address: shippingAddress.trim(),
        order_source: orderSource,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: 0,
        gift_wrap_fee: 0,
        total_amount: total,
        status: 'Confirmed',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'COD' ? 'pending' : 'verified',
        items: orderItems.map((it) => {
          const prod = products.find((p) => p.id === it.productId);
          const price = prod?.sale_price || prod?.regular_price || 0;
          return {
            product_id: prod?.id,
            product_title: prod?.title || 'Personalized Gift',
            sku: prod?.sku,
            unit_price: price,
            unit_cost: prod?.base_cost_price || Math.round(price * 0.4),
            quantity: it.quantity,
            line_total: price * it.quantity,
            customization_data: it.customText ? { name_text: it.customText } : undefined,
          };
        }),
      });

      toast.success(`Manual Order #${created.order_number || orderNumber} saved to database!`);
      router.push('/admin/orders');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save manual order.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 select-none pb-12">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-black text-text-primary">
              Create Manual Order
            </h1>
            <p className="text-xs text-text-muted">
              Book offline orders from WhatsApp, Instagram DMs, Facebook, or Phone calls
            </p>
          </div>
        </div>

        <Button type="submit" variant="gold" size="md" isLoading={isSaving} className="font-bold uppercase tracking-wider text-xs">
          Save &amp; Book Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
            Customer Information
          </h3>

          <Input
            label="Customer Name"
            placeholder="Full name"
            value={customerName}
            required
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Input
            label="Mobile Phone (WhatsApp)"
            placeholder="03001234567"
            value={customerPhone}
            required
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <Select
            label="Destination City"
            value={shippingCity}
            onChange={(e) => setShippingCity(e.target.value)}
            options={PAKISTAN_MAJOR_CITIES.map((c) => ({ value: c, label: c }))}
          />

          <Textarea
            label="Street Address & Nearest Landmark"
            placeholder="Delivery address..."
            value={shippingAddress}
            required
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
            Channel Source &amp; Payment
          </h3>

          <Select
            label="Order Acquisition Channel"
            value={orderSource}
            onChange={(e) => setOrderSource(e.target.value)}
            options={[
              { value: 'WhatsApp', label: 'WhatsApp Inquiry' },
              { value: 'Instagram', label: 'Instagram DM' },
              { value: 'Facebook', label: 'Facebook Messenger' },
              { value: 'TikTok', label: 'TikTok Shop / Lead' },
              { value: 'Phone', label: 'Phone Call' },
              { value: 'WalkIn', label: 'Lahore Studio Walk-in' },
            ]}
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'COD', label: 'Cash on Delivery (COD)' },
              { value: 'JazzCash', label: 'JazzCash' },
              { value: 'Easypaisa', label: 'Easypaisa' },
              { value: 'BankTransfer', label: 'Online Bank Transfer' },
            ]}
          />

          <Input
            type="number"
            label="Shipping Charges (PKR)"
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
          />

          <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-bold">
            <span>Total Payable:</span>
            <span className="font-serif text-gold text-lg">{formatPKR(total)}</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h3 className="font-serif font-bold text-base text-text-primary">
            Ordered Products
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="space-y-3">
          {orderItems.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-elevated/40 border border-border">
              <div className="flex-1 w-full">
                <Select
                  value={item.productId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOrderItems((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, productId: val } : it))
                    );
                  }}
                  options={products.map((p) => ({
                    value: p.id,
                    label: `${p.title} (${formatPKR(p.sale_price || p.regular_price)})`,
                  }))}
                />
              </div>

              <div className="w-full sm:w-48">
                <Input
                  placeholder="Custom Name / Inscription"
                  value={item.customText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOrderItems((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, customText: val } : it))
                    );
                  }}
                  className="h-10 text-xs"
                />
              </div>

              <div className="w-full sm:w-24">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOrderItems((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, quantity: val } : it))
                    );
                  }}
                  className="h-10 text-xs"
                />
              </div>

              {orderItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 text-text-muted hover:text-status-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
