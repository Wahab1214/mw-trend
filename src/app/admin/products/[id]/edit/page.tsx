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
import {
  fetchCatalogData,
  fetchProductByIdOrSlug,
  createCategoryApi,
  updateProductApi,
} from '@/lib/catalog-client';
import { useCatalog } from '@/lib/store/catalog-context';
import { Product, Category, PaymentMethod, MockupType, ProductImage } from '@/types';
import { recordAuditLog } from '@/lib/audit';
import { slugify } from '@/lib/utils';
import { ProductImageUploader } from '@/components/admin/product-image-uploader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const { refreshCatalog } = useCatalog();
  const productId = params?.id as string;

  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [categoriesList, setCategoriesList] = React.useState<Category[]>(INITIAL_CATEGORIES);
  const [category, setCategory] = React.useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = React.useState(false);
  const [customCategoryName, setCustomCategoryName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [images, setImages] = React.useState<ProductImage[]>([]);
  const [baseCostPrice, setBaseCostPrice] = React.useState<number>(0);
  const [regularPrice, setRegularPrice] = React.useState<number>(0);
  const [salePrice, setSalePrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);
  const [hasCustomization, setHasCustomization] = React.useState(false);
  const [mockupType, setMockupType] = React.useState<MockupType>('none');
  const [allowedMethods, setAllowedMethods] = React.useState<PaymentMethod[]>(['COD', 'JazzCash', 'Easypaisa', 'BankTransfer']);
  const [focusKeyword, setFocusKeyword] = React.useState('');
  const [seoTitle, setSeoTitle] = React.useState('');
  const [seoDescription, setSeoDescription] = React.useState('');

  React.useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([fetchCatalogData(true), fetchProductByIdOrSlug(productId)])
      .then(([catalog, match]) => {
        if (!active) return;
        if (catalog.categories?.length) {
          setCategoriesList(catalog.categories);
        }
        const resolved =
          match || catalog.products.find((p) => p.id === productId || p.slug === productId) || null;
        if (resolved) {
          setProduct(resolved);
          setTitle(resolved.title);
          setSlug(resolved.slug);
          setSku(resolved.sku || '');
          setCategory(resolved.category_id || catalog.categories?.[0]?.id || '');
          setDescription(resolved.description || '');
          setImages(resolved.images || []);
          setBaseCostPrice(resolved.base_cost_price || 0);
          setRegularPrice(resolved.regular_price || 0);
          setSalePrice(resolved.sale_price || 0);
          setStock(resolved.stock_quantity ?? 20);
          setHasCustomization(Boolean(resolved.has_customization));
          setMockupType(resolved.mockup_type || 'none');
          setAllowedMethods(
            resolved.allowed_payment_methods?.length
              ? resolved.allowed_payment_methods
              : ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer']
          );
          setFocusKeyword(resolved.focus_keyword || '');
          setSeoTitle(resolved.seo_title || '');
          setSeoDescription(resolved.seo_description || '');
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const handleCreateCategory = async () => {
    if (!customCategoryName.trim()) return;
    const cleanName = customCategoryName.trim();
    try {
      const created = await createCategoryApi({
        name: cleanName,
        description: `Personalized items under ${cleanName}`,
      });
      setCategoriesList((prev) => [...prev, created]);
      setCategory(created.id);
      await refreshCatalog();
      setCustomCategoryName('');
      setShowNewCategoryInput(false);
      toast.success(`Category "${created.name}" created and synced!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create category.');
    }
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    setAllowedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    try {
      await updateProductApi(product.id, {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        sku: sku.trim() || undefined,
        category_id: category || undefined,
        description,
        images,
        base_cost_price: Number(baseCostPrice) || 0,
        regular_price: Number(regularPrice) || 0,
        sale_price: salePrice > 0 ? Number(salePrice) : (null as any),
        stock_quantity: Number(stock) || 0,
        has_customization: hasCustomization,
        mockup_type: mockupType,
        allowed_payment_methods: allowedMethods,
        focus_keyword: focusKeyword,
        seo_title: seoTitle,
        seo_description: seoDescription,
      });

      await refreshCatalog();
      recordAuditLog('PRODUCT_UPDATED', title, `Updated product SKU: ${sku || productId}`);
      toast.success(`Product "${title}" saved to cloud database!`, 'Catalog Synced');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save product updates to database.');
    } finally {
      setIsSaving(false);
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

        <Button type="submit" variant="gold" size="md" isLoading={isSaving} className="font-bold uppercase tracking-wider text-xs">
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

            {/* Category selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#A8A29A] uppercase tracking-wider">
                  Product Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                  className="text-xs text-gold hover:underline font-medium"
                >
                  {showNewCategoryInput ? 'Cancel' : '+ New Category'}
                </button>
              </div>

              {showNewCategoryInput ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name..."
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className="h-10 text-xs"
                  />
                  <Button
                    type="button"
                    variant="gold"
                    size="sm"
                    onClick={handleCreateCategory}
                    className="shrink-0 text-xs font-bold"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={categoriesList.map((c) => ({ value: c.id, label: c.name }))}
                />
              )}
            </div>

            <Textarea label="Description" value={description} rows={4} onChange={(e) => setDescription(e.target.value)} />

            {/* Product Photos Upload (Up to 6 images) */}
            <ProductImageUploader
              images={images}
              onChange={setImages}
              maxImages={6}
            />
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
