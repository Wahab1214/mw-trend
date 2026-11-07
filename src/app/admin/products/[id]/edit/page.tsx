'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast';
import { INITIAL_CATEGORIES } from '@/lib/mock-data';
import { Product, PaymentMethod, MockupType } from '@/types';
import { recordAuditLog } from '@/lib/audit';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const productId = params?.id as string;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [baseCostPrice, setBaseCostPrice] = React.useState<number>(0);
  const [regularPrice, setRegularPrice] = React.useState<number>(0);
  const [salePrice, setSalePrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);
  const [hasCustomization, setHasCustomization] = React.useState(false);
  const [mockupType, setMockupType] = React.useState<MockupType>('mug');
  const [allowedMethods, setAllowedMethods] = React.useState<PaymentMethod[]>(['COD', 'JazzCash', 'Easypaisa', 'BankTransfer']);
  const [focusKeyword, setFocusKeyword] = React.useState('');
  const [seoTitle, setSeoTitle] = React.useState('');
  const [seoDescription, setSeoDescription] = React.useState('');

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_products');
      if (stored) {
        const list: Product[] = JSON.parse(stored);
        const match = list.find((p) => p.id === productId);
        if (match) {
          setProduct(match);
          setTitle(match.title);
          setSlug(match.slug);
          setSku(match.sku || '');
          setCategory(match.category_id || INITIAL_CATEGORIES[0]?.id || '');
          setDescription(match.description);
          setBaseCostPrice(match.base_cost_price);
          setRegularPrice(match.regular_price);
          setSalePrice(match.sale_price || 0);
          setStock(match.stock_quantity);
          setHasCustomization(match.has_customization);
          setMockupType(match.mockup_type || 'mug');
          setAllowedMethods(match.allowed_payment_methods || ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer']);
          setFocusKeyword(match.focus_keyword || '');
          setSeoTitle(match.seo_title || '');
          setSeoDescription(match.seo_description || '');
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const togglePaymentMethod = (method: PaymentMethod) => {
    setAllowedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const stored = localStorage.getItem('mw_trends_products');
      const list: Product[] = stored ? JSON.parse(stored) : [];
      const updatedList = list.map((p) => {
        if (p.id === productId) {
          const selectedCatObj = INITIAL_CATEGORIES.find((c) => c.id === category);
          return {
            ...p,
            title,
            slug,
            sku,
            category_id: category,
            category_name: selectedCatObj ? selectedCatObj.name : p.category_name,
            description,
            base_cost_price: baseCostPrice,
            regular_price: regularPrice,
            sale_price: salePrice || undefined,
            stock_quantity: stock,
            has_customization: hasCustomization,
            mockup_type: mockupType,
            allowed_payment_methods: allowedMethods,
            focus_keyword: focusKeyword,
            seo_title: seoTitle,
            seo_description: seoDescription,
          };
        }
        return p;
      });

      localStorage.setItem('mw_trends_products', JSON.stringify(updatedList));
      recordAuditLog('PRODUCT_UPDATED', title, `Updated product SKU: ${sku || productId}`);
      toast.success(`Product "${title}" updated successfully!`, 'Catalog Saved');
      router.push('/admin/products');
    } catch {
      toast.error('Failed to save product updates.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-xs text-text-muted">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-gold mx-auto" />
        <h2 className="font-serif text-xl font-bold text-text-primary">Product Not Found</h2>
        <p className="text-xs text-text-secondary">
          The requested product does not exist in your catalog or was removed.
        </p>
        <Link href="/admin/products">
          <Button variant="gold" size="sm" className="font-bold">
            Back to Products Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-8 select-none pb-12">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-black text-text-primary">
              Edit Product: {title}
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
