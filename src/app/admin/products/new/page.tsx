'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast';
import { slugify } from '@/lib/utils';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { recordAuditLog } from '@/lib/audit';
import { PaymentMethod, MockupType } from '@/types';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  HelpCircle,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();

  // Basic Information
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [category, setCategory] = React.useState(INITIAL_CATEGORIES[0]?.id || '');
  const [shortDesc, setShortDesc] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  // Pricing & Profit
  const [baseCostPrice, setBaseCostPrice] = React.useState<number>(400);
  const [regularPrice, setRegularPrice] = React.useState<number>(1299);
  const [salePrice, setSalePrice] = React.useState<number>(999);
  const [stock, setStock] = React.useState<number>(50);

  // Customization
  const [hasCustomization, setHasCustomization] = React.useState(true);
  const [mockupType, setMockupType] = React.useState<MockupType>('mug');
  const [allowCustomerUpload, setAllowCustomerUpload] = React.useState(false);

  // Allowed Payment Methods
  const [allowedMethods, setAllowedMethods] = React.useState<PaymentMethod[]>([
    'COD',
    'JazzCash',
    'Easypaisa',
    'BankTransfer',
    'Card',
  ]);

  // SEO Fields
  const [seoTitle, setSeoTitle] = React.useState('');
  const [seoDescription, setSeoDescription] = React.useState('');
  const [focusKeyword, setFocusKeyword] = React.useState('');

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    setAllowedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  // Real-time SEO checklist score calculation
  const seoChecklist = React.useMemo(() => {
    const checks = [
      { id: 'title_len', label: 'Title length is between 20-60 characters', pass: title.length >= 20 && title.length <= 60 },
      { id: 'keyword_set', label: 'Focus keyword defined', pass: !!focusKeyword.trim() },
      { id: 'keyword_in_title', label: 'Focus keyword appears in product title', pass: !!focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase()) },
      { id: 'desc_len', label: 'Meta description between 80-160 characters', pass: seoDescription.length >= 80 && seoDescription.length <= 160 },
      { id: 'slug_valid', label: 'URL slug is clean and hyphenated', pass: !!slug && !slug.includes(' ') },
    ];
    const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
    return { checks, score };
  }, [title, focusKeyword, seoDescription, slug]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Product title is required.');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    const newProduct: any = {
      id: `prod_${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      sku: sku.trim() || `MW-${Date.now().toString().slice(-6)}`,
      short_description: shortDesc,
      description: description,
      category_id: category,
      base_cost_price: Number(baseCostPrice) || 0,
      regular_price: Number(regularPrice) || 0,
      sale_price: salePrice ? Number(salePrice) : undefined,
      stock_quantity: Number(stock) || 0,
      low_stock_threshold: 5,
      track_stock: true,
      is_published: true,
      is_featured: false,
      is_trending: true,
      is_new: true,
      allowed_payment_methods: allowedMethods,
      weight_kg: 0.5,
      has_customization: hasCustomization,
      mockup_type: mockupType,
      images: imageUrl.trim()
        ? [
            {
              id: `img_${Date.now()}`,
              product_id: `prod_${Date.now()}`,
              image_url: imageUrl.trim(),
              sort_order: 1,
              is_primary: true,
            },
          ]
        : [
            {
              id: `img_${Date.now()}`,
              product_id: `prod_${Date.now()}`,
              image_url:
                mockupType === 'pen'
                  ? 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
                  : mockupType === 'tshirt'
                  ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
                  : mockupType === 'card'
                  ? 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
              sort_order: 1,
              is_primary: true,
            },
          ],
      rating_average: 5.0,
      rating_count: 0,
      sales_count: 0,
      seo_title: seoTitle,
      seo_description: seoDescription,
      focus_keyword: focusKeyword,
    };

    try {
      const stored = localStorage.getItem('mw_trends_products');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mw_trends_products', JSON.stringify([newProduct, ...existing]));
      recordAuditLog('PRODUCT_CREATED', title, `Created new product with SKU: ${sku}`);
    } catch {
      // ignore
    }

    toast.success(`Product "${title}" added to your live catalog!`, 'Catalog Updated');
    router.push('/admin/products');
  };

  return (
    <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-8 select-none pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-elevated">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-black text-text-primary">
              Create New Product
            </h1>
            <p className="text-xs text-text-muted">
              Add a print-on-demand product with live 3D preview &amp; custom fields
            </p>
          </div>
        </div>

        <Button type="submit" variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
          Publish Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: Basic Info, Customization, Pricing */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Basic Info */}
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              General Information
            </h3>

            <Input
              label="Product Title"
              placeholder="e.g. Royal Gold Monogram Ceramic Mug"
              value={title}
              required
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="URL Slug (Permanent link)"
                value={slug}
                required
                onChange={(e) => setSlug(e.target.value)}
              />
              <Input
                label="SKU (Inventory Reference)"
                placeholder="MUG-GOLD-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>

            <Select
              label="Product Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={INITIAL_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Textarea
              label="Short Description"
              placeholder="Brief 1-2 sentence highlight shown in cards..."
              value={shortDesc}
              charLimit={150}
              onChange={(e) => setShortDesc(e.target.value)}
            />

            <Textarea
              label="Detailed Description"
              placeholder="Complete craftsmanship, material specs, care instructions..."
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              label="Product Image URL (Unsplash or Supabase Storage)"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              helperText="Paste direct high-resolution image URL."
            />
          </div>

          {/* 2. Customization Builder */}
          <div className="rounded-2xl bg-surface border border-gold/40 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="font-serif font-bold text-base text-text-primary">
                  Customization &amp; 3D Mockup Engine
                </h3>
              </div>
              <Switch
                checked={hasCustomization}
                onCheckedChange={setHasCustomization}
              />
            </div>

            {hasCustomization && (
              <div className="space-y-4 pt-1">
                <Select
                  label="Mockup Template Layer"
                  value={mockupType}
                  onChange={(e) => setMockupType(e.target.value as MockupType)}
                  options={[
                    { value: 'mug', label: 'Ceramic Drinkware Mug (Gold Foil Monogram)' },
                    { value: 'pen', label: 'Executive Rollerball Pen (Laser Etched)' },
                    { value: 'tshirt', label: '240 GSM Streetwear T-Shirt (Chest Print)' },
                    { value: 'hoodie', label: '360 GSM Fleece Hoodie (Embroidered)' },
                    { value: 'cap', label: 'Vintage Washed Cap (Arched 3D Stitching)' },
                    { value: 'phone_case', label: 'Impact Phone Case (Calligraphy Monogram)' },
                    { value: 'card', label: 'Greeting Card (Gold Calligraphy + Wax Seal)' },
                  ]}
                />

                <div className="rounded-xl bg-elevated/40 border border-border p-4 space-y-2 text-xs text-text-secondary">
                  <span className="font-bold text-text-primary block">Active Fields Configured:</span>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Recipient Name text field (max 25 chars)</li>
                    <li>Font typography selector (Playfair Serif, Script, Gothic, Modern)</li>
                    <li>Color finish selector (Pure Gold, Rose Gold, Off-White, Black)</li>
                  </ul>
                </div>

                {/* Phase 2 Upload Toggle */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">Customer Design / File Upload (Phase 2)</span>
                    <span className="text-[11px] text-text-muted">Allow customers to upload vector logos or photos (Disabled by default)</span>
                  </div>
                  <Switch
                    checked={allowCustomerUpload}
                    onCheckedChange={setAllowCustomerUpload}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Pricing, Cost & Stock */}
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Pricing, Cost &amp; Inventory (PKR)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Base Cost Price (Studio cost)"
                value={baseCostPrice}
                onChange={(e) => setBaseCostPrice(Number(e.target.value))}
                helperText="For profit margin calculations."
              />
              <Input
                type="number"
                label="Regular Price (PKR)"
                value={regularPrice}
                required
                onChange={(e) => setRegularPrice(Number(e.target.value))}
              />
              <Input
                type="number"
                label="Sale Price (Optional)"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Initial Stock Quantity"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
              <div className="p-3 rounded-xl bg-elevated/50 border border-border flex items-center justify-between text-xs">
                <span>Estimated Net Profit Per Sale:</span>
                <strong className="font-serif text-emerald-500 font-bold text-sm">
                  Rs. {Math.max(0, (salePrice || regularPrice) - baseCostPrice)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Payment methods & SEO Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Per-Product Payment Methods Control */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
              Allowed Payment Methods
            </h3>
            <p className="text-xs text-text-muted">
              Select which payment methods are accepted for this specific product:
            </p>

            <div className="space-y-2">
              {(['COD', 'JazzCash', 'Easypaisa', 'BankTransfer', 'Card'] as PaymentMethod[]).map((method) => {
                const isChecked = allowedMethods.includes(method);
                return (
                  <label
                    key={method}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-elevated cursor-pointer text-xs select-none"
                  >
                    <span className="font-semibold text-text-primary">
                      {method === 'COD' ? 'Cash on Delivery (COD)' : method}
                    </span>
                    <Checkbox
                      checked={isChecked}
                      onChange={() => togglePaymentMethod(method)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* SEO Metadata & Focus Keyword with Checklist */}
          <div className="rounded-2xl bg-surface border border-border p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-serif font-bold text-base text-text-primary">
                Search Engine Optimization
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                seoChecklist.score >= 80 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-gold/15 text-gold'
              }`}>
                Score: {seoChecklist.score}%
              </span>
            </div>

            <Input
              label="Focus Search Keyword"
              placeholder="e.g. custom mug pakistan"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
            />

            <Input
              label="SEO Meta Title"
              placeholder="e.g. Royal Gold Monogram Mug | MW Trends"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <Textarea
              label="SEO Meta Description"
              placeholder="Search snippet shown on Google (120-160 chars)..."
              value={seoDescription}
              charLimit={160}
              onChange={(e) => setSeoDescription(e.target.value)}
            />

            {/* Checklist */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                SEO Audit Checklist
              </span>
              {seoChecklist.checks.map((chk) => (
                <div key={chk.id} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${chk.pass ? 'text-status-success' : 'text-border-light text-text-muted/40'}`} />
                  <span className={chk.pass ? 'text-text-primary' : 'text-text-muted'}>{chk.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
