'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/mock-data';
import { PaymentMethod, MockupType } from '@/types';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const productId = params?.id as string;

  const product = INITIAL_PRODUCTS.find((p) => p.id === productId) || INITIAL_PRODUCTS[0];

  const [title, setTitle] = React.useState(product.title);
  const [slug, setSlug] = React.useState(product.slug);
  const [sku, setSku] = React.useState(product.sku || '');
  const [category, setCategory] = React.useState(product.category_id || INITIAL_CATEGORIES[0]?.id);
  const [description, setDescription] = React.useState(product.description);
  const [baseCostPrice, setBaseCostPrice] = React.useState<number>(product.base_cost_price);
  const [regularPrice, setRegularPrice] = React.useState<number>(product.regular_price);
  const [salePrice, setSalePrice] = React.useState<number>(product.sale_price || 0);
  const [stock, setStock] = React.useState<number>(product.stock_quantity);
  const [hasCustomization, setHasCustomization] = React.useState(product.has_customization);
  const [mockupType, setMockupType] = React.useState<MockupType>(product.mockup_type || 'mug');
  const [allowedMethods, setAllowedMethods] = React.useState<PaymentMethod[]>(product.allowed_payment_methods);
  const [focusKeyword, setFocusKeyword] = React.useState(product.focus_keyword || '');
  const [seoTitle, setSeoTitle] = React.useState(product.seo_title || '');
  const [seoDescription, setSeoDescription] = React.useState(product.seo_description || '');

  const togglePaymentMethod = (method: PaymentMethod) => {
    setAllowedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Product "${title}" updated successfully!`, 'Catalog Saved');
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-8 select-none pb-12">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-black text-text-primary">
              Edit Product: {product.title}
            </h1>
            <p className="text-xs text-text-muted">ID: {product.id}</p>
          </div>
        </div>

        <Button type="submit" variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Product Information
            </h3>

            <Input label="Title" value={title} required onChange={(e) => setTitle(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Slug" value={slug} required onChange={(e) => setSlug(e.target.value)} />
              <Input label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
            </div>

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={INITIAL_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Textarea label="Description" value={description} rows={4} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Pricing, Cost &amp; Profit
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input type="number" label="Base Cost (PKR)" value={baseCostPrice} onChange={(e) => setBaseCostPrice(Number(e.target.value))} />
              <Input type="number" label="Regular Price (PKR)" value={regularPrice} onChange={(e) => setRegularPrice(Number(e.target.value))} />
              <Input type="number" label="Sale Price (PKR)" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
            </div>

            <Input type="number" label="Stock Quantity" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Allowed Payment Methods
            </h3>
            {(['COD', 'JazzCash', 'Easypaisa', 'BankTransfer', 'Card'] as PaymentMethod[]).map((method) => (
              <label key={method} className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-elevated cursor-pointer text-xs">
                <span>{method === 'COD' ? 'Cash on Delivery (COD)' : method}</span>
                <Checkbox checked={allowedMethods.includes(method)} onChange={() => togglePaymentMethod(method)} />
              </label>
            ))}
          </div>

          <div className="rounded-2xl bg-surface border border-border p-5 space-y-3 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              SEO Fields
            </h3>
            <Input label="Focus Keyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} />
            <Input label="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <Textarea label="SEO Description" value={seoDescription} charLimit={160} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
        </div>
      </div>
    </form>
  );
}
