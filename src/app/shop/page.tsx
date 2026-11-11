'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/storefront/product-card';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { useCatalog } from '@/lib/store/catalog-context';
import { LayoutGrid, List, X, Sparkles, Filter } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories, products: allProducts } = useCatalog();

  // Read URL params
  const categoryParam = searchParams.get('category') || '';
  const queryParam = searchParams.get('q') || '';
  const saleParam = searchParams.get('sale') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = React.useState(categoryParam);
  const [searchQuery, setSearchQuery] = React.useState(queryParam);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [onSaleOnly, setOnSaleOnly] = React.useState(saleParam);
  const [minPrice, setMinPrice] = React.useState<number>(0);
  const [maxPrice, setMaxPrice] = React.useState<number>(10000);
  const [sortBy, setSortBy] = React.useState(sortParam);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  const ITEMS_PER_PAGE = 12;

  // Sync state if URL changes
  React.useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchQuery(queryParam);
    setOnSaleOnly(saleParam);
    setSortBy(sortParam);
  }, [categoryParam, queryParam, saleParam, sortParam]);

  // Filter & Sort logic
  const filteredProducts = React.useMemo(() => {
    return allProducts
      .filter((product) => {
        if (selectedCategory) {
          const catObj = categories.find((c) => c.slug === selectedCategory);
          const matchById = catObj && product.category_id === catObj.id;
          const matchByName =
            catObj && product.category_name?.toLowerCase() === catObj.name.toLowerCase();
          if (!matchById && !matchByName) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = product.title.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesCat = product.category_name?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCat) return false;
        }

        if (inStockOnly && product.track_stock && product.stock_quantity <= 0) return false;

        if (onSaleOnly && (!product.sale_price || product.sale_price >= product.regular_price)) {
          return false;
        }

        const effectivePrice = product.sale_price || product.regular_price;
        if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.sale_price || a.regular_price;
        const priceB = b.sale_price || b.regular_price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'featured') return Number(b.is_featured) - Number(a.is_featured);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [allProducts, categories, selectedCategory, searchQuery, inStockOnly, onSaleOnly, minPrice, maxPrice, sortBy]);

  // Paginated items
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy('newest');
    setCurrentPage(1);
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: 'Shop Catalog', href: '/shop' },
          ...(selectedCategory ? [{ label: selectedCategory.replace('-', ' ') }] : []),
        ]}
      />

      {/* Catalog Header */}
      <div className="py-4 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Collection
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-black text-text-primary mt-1">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Custom Gifts'
              : 'All Personalized Gifts'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Showing {filteredProducts.length} unique handcrafted items in Pakistan
          </p>
        </div>

        {/* Controls: Sort and Grid/List toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden gap-1.5"
          >
            <Filter className="w-4 h-4 text-gold" />
            <span>Filters</span>
          </Button>

          {/* Sort Dropdown */}
          <div className="w-44">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'featured', label: 'Featured' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
              ]}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-lg p-0.5 bg-surface">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-gold text-black' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-gold text-black' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Filter Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:block ${
            isMobileFilterOpen
              ? 'fixed inset-0 z-50 bg-surface p-6 overflow-y-auto'
              : 'hidden'
          } space-y-6 lg:border-r lg:border-border lg:pr-6`}
        >
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-border lg:hidden">
              <h3 className="font-serif font-bold text-lg text-text-primary">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Search Products
            </label>
            <Input
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Category
              </span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="text-[11px] text-gold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-gold/15 text-gold font-bold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-text-muted">{cat.product_count ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Price Range (PKR)
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="h-9 text-xs"
              />
              <span className="text-text-muted">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Quick Filter Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-border">
            <Checkbox
              label="On Sale Deals Only"
              checked={onSaleOnly}
              onChange={(e) => setOnSaleOnly(e.target.checked)}
            />
            <Checkbox
              label="In Stock Ready To Ship"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full text-xs"
          >
            Reset All Filters
          </Button>

          {isMobileFilterOpen && (
            <Button
              variant="gold"
              size="md"
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full text-xs font-bold uppercase tracking-wider mt-4"
            >
              Apply Filters ({filteredProducts.length})
            </Button>
          )}
        </aside>

        {/* Products Grid View */}
        <main className="lg:col-span-3">
          {paginatedProducts.length === 0 ? (
            <EmptyState
              title="No products match your criteria"
              description="Try resetting your filters or adjusting your price range to discover more items."
              actionLabel="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-text-muted">
          Loading catalog...
        </div>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}
