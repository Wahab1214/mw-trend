'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useCatalog } from '@/lib/store/catalog-context';
import { fetchProductByIdOrSlug } from '@/lib/catalog-client';
import { Product, CustomizationValues } from '@/types';
import { Price } from '@/components/ui/price';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Tabs } from '@/components/ui/tabs';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { LiveMockupPreview } from '@/components/customization/live-mockup-preview';
import { CustomizationForm } from '@/components/customization/customization-form';
import { ProductCard } from '@/components/storefront/product-card';
import { useCart } from '@/lib/store/cart-context';
import { useWishlist } from '@/lib/store/wishlist-context';
import { formatPKR } from '@/lib/utils';
import {
  Heart,
  ShoppingBag,
  Share2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { products, categories, reviews, settings, isLoading } = useCatalog();
  const [remoteProduct, setRemoteProduct] = React.useState<Product | null>(null);
  const [lookupDone, setLookupDone] = React.useState(false);

  const contextProduct = React.useMemo(
    () => products.find((p) => p.slug === slug || p.id === slug),
    [products, slug]
  );

  const product = remoteProduct || contextProduct;

  React.useEffect(() => {
    let active = true;
    if (contextProduct) {
      setLookupDone(true);
      return;
    }
    if (isLoading) return;

    fetchProductByIdOrSlug(slug)
      .then((found) => {
        if (!active) return;
        if (found) setRemoteProduct(found);
        setLookupDone(true);
      })
      .catch(() => {
        if (active) setLookupDone(true);
      });

    return () => {
      active = false;
    };
  }, [slug, isLoading, contextProduct]);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // States
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(undefined);
  const [quantity, setQuantity] = React.useState(1);
  const [customValues, setCustomValues] = React.useState<CustomizationValues>({
    name_text: '',
    font_choice: 'Playfair Serif',
    text_color: 'Pure Gold',
  });
  const [isCopiedShare, setIsCopiedShare] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState<'photo' | 'mockup'>('photo');

  React.useEffect(() => {
    if (product?.variants?.length && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  if (!product && (isLoading || !lookupDone)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-7 aspect-square rounded-2xl bg-surface border border-border" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-4 w-32 bg-surface rounded" />
            <div className="h-8 w-3/4 bg-surface rounded" />
            <div className="h-6 w-40 bg-surface rounded" />
            <div className="h-28 w-full bg-surface rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isWishlisted = isInWishlist(product.id);
  const categoryObj = categories.find((c) => c.id === product.category_id);

  // Selected variant calculations
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const effectivePrice = selectedVariant?.price || product.sale_price || product.regular_price;
  const regularPrice = product.regular_price;
  const currentStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const productImages = product.images || [];
  const canShowMockup = Boolean(product.has_customization && product.mockup_type && product.mockup_type !== 'none');

  const handleAddToCart = () => {
    const primaryImg = productImages[0]?.image_url || '/brand/monogram.svg';

    addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id,
      title: product.title,
      variant_title: selectedVariant?.title,
      sku: selectedVariant?.sku || product.sku,
      image_url: primaryImg,
      unit_price: effectivePrice,
      unit_cost: selectedVariant?.cost_price || product.base_cost_price,
      quantity,
      allowed_payment_methods: product.allowed_payment_methods,
      mockup_type: product.mockup_type,
      customization_data: product.has_customization ? customValues : undefined,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out "${product.title}" on ${settings.store_name || 'MW Trends'}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopiedShare(true);
      setTimeout(() => setIsCopiedShare(false), 2000);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.is_published && p.category_id === product.category_id)
    .slice(0, 4);

  const productReviews = reviews.filter((r) => r.product_id === product.id);

  // WhatsApp order URL
  const waClean = (settings.whatsapp_number || '+92 337 0566870').replace(/[^0-9]/g, '');
  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const whatsappText = encodeURIComponent(
    `Hi ${settings.store_name || 'MW Trends'}, I would like to order: "${product.title}" (SKU: ${product.sku || 'N/A'}). ${originUrl}/product/${product.slug}`
  );
  const whatsappUrl = `https://wa.me/${waClean}?text=${whatsappText}`;

  // JSON-LD Product Schema
  const productJsonLd: Record<string, any> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: productImages.map((img) => img.image_url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: settings.store_name || 'MW Trends',
    },
    offers: {
      '@type': 'Offer',
      url: `${originUrl}/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: effectivePrice,
      availability: currentStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.reviews_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating_average,
            reviewCount: product.reviews_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/shop' },
            ...(categoryObj
              ? [{ label: categoryObj.name, href: `/category/${categoryObj.slug}` }]
              : product.category_name
                ? [{ label: product.category_name, href: '/shop' }]
                : []),
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          {/* LEFT: Image Gallery & Custom Preview */}
          <div className="lg:col-span-7 space-y-4">
            {/* View switcher if product has mockup customization */}
            {canShowMockup && (
              <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border w-fit">
                <button
                  type="button"
                  onClick={() => setPreviewMode('photo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    previewMode === 'photo'
                      ? 'bg-gold text-black'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Studio Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mockup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    previewMode === 'mockup'
                      ? 'bg-gold text-black'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Text Preview</span>
                </button>
              </div>
            )}

            {/* Display Area */}
            {previewMode === 'mockup' && canShowMockup ? (
              <LiveMockupPreview
                mockupType={product.mockup_type}
                customValues={customValues}
                baseImage={productImages[0]?.image_url}
              />
            ) : (
              <div className="relative w-full aspect-square rounded-2xl bg-[#0E0E0E] border border-border overflow-hidden shadow-md">
                {productImages[activeImageIndex]?.image_url ? (
                  <Image
                    src={productImages[activeImageIndex].image_url}
                    alt={productImages[activeImageIndex].alt_text || product.title}
                    fill
                    unoptimized={productImages[activeImageIndex].image_url?.startsWith('data:')}
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#121212] via-[#1B1915] to-[#0B0B0B]">
                    <div className="w-24 h-24 rounded-2xl border border-gold/30 bg-black/50 p-4 flex items-center justify-center mb-4">
                      <Image
                        src="/brand/monogram.svg"
                        alt="MW Trends"
                        width={64}
                        height={64}
                        className="opacity-90"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                      {categoryObj?.name || product.category_name || 'MW Trends Studio'}
                    </span>
                    <p className="text-xs text-text-muted max-w-xs mt-2 leading-relaxed">
                      Product studio photo will appear here soon. Tap Order via WhatsApp for live sample images.
                    </p>
                  </div>
                )}
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="warning" size="md">
                      Low Stock: Only {product.stock_quantity} left
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail selector */}
            {productImages.length > 1 && previewMode === 'photo' && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {productImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-gold shadow-gold-glow' : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || `Thumbnail ${idx + 1}`}
                      fill
                      unoptimized={img.image_url?.startsWith('data:')}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs, Customization, Buy Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header / Titles */}
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                  {product.category_name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-lg text-text-muted hover:text-gold hover:bg-elevated transition-colors"
                    aria-label="Share product"
                    title="Share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {isCopiedShare && (
                    <span className="text-[10px] text-gold font-bold">Link Copied!</span>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id, product.title)}
                    className={`p-2 rounded-lg transition-colors ${
                      isWishlisted ? 'text-rose-500' : 'text-text-muted hover:text-gold hover:bg-elevated'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <Price
                  price={regularPrice}
                  salePrice={product.sale_price}
                  size="xl"
                />
                {product.reviews_count > 0 && (
                  <Rating value={product.rating_average} count={product.reviews_count} size="sm" />
                )}
              </div>

              {product.sku && (
                <div className="text-[11px] text-text-muted pt-1">
                  SKU: <span className="font-mono text-text-primary">{product.sku}</span>
                </div>
              )}
            </div>

            {/* Variants Selector (Size / Color) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Select Variant / Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = v.id === selectedVariantId;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/15 text-gold shadow-sm font-bold'
                            : 'border-border bg-surface text-text-primary hover:border-gold/40'
                        }`}
                      >
                        {v.title}
                        {v.stock_quantity <= 3 && v.stock_quantity > 0 && (
                          <span className="ml-1.5 text-[10px] text-amber-500 font-normal">
                            ({v.stock_quantity} left)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Form Engine */}
            {product.has_customization && product.custom_fields_schema && (
              <div className="pt-2">
                <CustomizationForm
                  fields={product.custom_fields_schema}
                  values={customValues}
                  onChange={(vals) => {
                    setCustomValues(vals);
                    if (canShowMockup && vals.name_text?.trim()) {
                      setPreviewMode('mockup');
                    }
                  }}
                  allowCustomerUpload={product.allow_customer_upload}
                />
              </div>
            )}

            {/* Quantity and Primary CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={Math.min(currentStock, 20)}
                />

                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 gap-2 uppercase tracking-wider font-extrabold text-xs sm:text-sm shadow-gold-glow"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag • {formatPKR(effectivePrice * quantity)}</span>
                </Button>
              </div>

              {/* Order via WhatsApp Shortcut */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full gap-2 text-xs font-semibold border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp</span>
                </Button>
              </a>
            </div>

            {/* Allowed Payment Methods Per-Product */}
            <div className="rounded-xl bg-elevated/40 border border-border p-3.5 space-y-2 text-xs">
              <span className="font-semibold text-text-primary block">
                Accepted Payment Methods For This Item:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.allowed_payment_methods.map((method) => (
                  <span
                    key={method}
                    className="px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-medium text-text-secondary"
                  >
                    {method === 'COD' ? 'Cash on Delivery (COD)' : method}
                  </span>
                ))}
              </div>
            </div>

            {/* Reassurance Shipping Bullet points */}
            <div className="space-y-2 pt-2 border-t border-border text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>
                  Nationwide Express Delivery in 24-48 hours. Free shipping over Rs. 3,000.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>
                  Safe arrival guaranteed. Replacement if damaged during courier transit.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Shipping & Delivery, Reviews */}
        <div className="mt-16 border-t border-border pt-8">
          <Tabs
            tabs={[
              {
                id: 'description',
                label: 'Product Details',
                content: (
                  <div className="max-w-3xl space-y-4 text-sm text-text-secondary leading-relaxed py-2">
                    <p>{product.description}</p>
                    <div className="rounded-xl bg-elevated/50 p-4 border border-border space-y-2">
                      <h4 className="font-serif font-bold text-text-primary text-sm">
                        Material &amp; Craftsmanship Specifications:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        <li>Weight: {product.weight_kg} kg studio certified</li>
                        <li>High precision laser etching / gold foil multi-pass printing</li>
                        <li>Microwave and dishwasher resistant (for ceramic drinkware)</li>
                        <li>Hand-inspected before dispatch from Lahore fulfillment studio</li>
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                id: 'shipping',
                label: 'Nationwide Delivery & COD',
                content: (
                  <div className="max-w-3xl space-y-3 text-sm text-text-secondary py-2">
                    <p>
                      All orders are crafted and dispatched within 24-48 hours from our Lahore studio. We partner with Pakistan&apos;s leading courier services including TCS, Leopards, Call Courier, and Trax.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-surface border border-border">
                        <strong className="text-xs font-bold text-text-primary block">Major Cities (Lahore, Karachi, Islamabad)</strong>
                        <span className="text-xs text-text-muted">1 - 2 Business Days delivery</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface border border-border">
                        <strong className="text-xs font-bold text-text-primary block">Other Cities &amp; Remote Regions</strong>
                        <span className="text-xs text-text-muted">2 - 4 Business Days delivery</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              ...(productReviews.length > 0
                ? [
                    {
                      id: 'reviews',
                      label: `Verified Reviews (${productReviews.length})`,
                      content: (
                        <div className="space-y-6 py-2 max-w-4xl">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-elevated/40 border border-border">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl font-serif font-black text-gold">
                                {product.rating_average}
                              </span>
                              <div>
                                <Rating value={product.rating_average} size="md" />
                                <span className="text-xs text-text-muted block mt-0.5">
                                  Based on {productReviews.length} verified buyer ratings
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="divide-y divide-border">
                            {productReviews.map((rev) => (
                              <div key={rev.id} className="py-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <strong className="text-xs font-bold text-text-primary block">
                                      {rev.author_name}
                                    </strong>
                                    <Rating value={rev.rating} size="sm" />
                                  </div>
                                  {rev.is_verified_buyer && (
                                    <Badge variant="success" size="sm">
                                      Verified Buyer
                                    </Badge>
                                  )}
                                </div>
                                {rev.title && (
                                  <h5 className="font-serif font-bold text-xs text-text-primary">
                                    {rev.title}
                                  </h5>
                                )}
                                <p className="text-xs text-text-secondary leading-relaxed">
                                  {rev.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                  Pair It With
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-text-primary mt-0.5">
                  Frequently Bought Together
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-gold hover:underline flex items-center gap-1">
                <span>See More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border p-3 shadow-2xl flex items-center justify-between gap-3 select-none">
        <div>
          <span className="text-[10px] text-text-muted block truncate max-w-[140px]">{product.title}</span>
          <span className="font-serif font-bold text-gold text-sm">{formatPKR(effectivePrice * quantity)}</span>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleAddToCart}
          className="gap-1.5 uppercase tracking-wider font-bold text-xs shrink-0 px-4"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add To Bag</span>
        </Button>
      </div>
    </>
  );
}
