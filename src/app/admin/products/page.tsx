'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  fetchCatalogData,
  deleteProductApi,
  createProductApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  uploadImageToCloud,
} from '@/lib/catalog-client';
import { useCatalog } from '@/lib/store/catalog-context';
import { Product, Category } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatPKR } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  PackageOpen,
  FolderOpen,
  Upload,
  Check,
  X,
} from 'lucide-react';

export default function AdminProductsPage() {
  const toast = useToast();
  const { refreshCatalog } = useCatalog();
  const [activeTab, setActiveTab] = React.useState<'products' | 'categories'>('products');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');

  // Category creation / editing states
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatDesc, setNewCatDesc] = React.useState('');
  const [isCreatingCat, setIsCreatingCat] = React.useState(false);
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [editCatName, setEditCatName] = React.useState('');
  const [editCatDesc, setEditCatDesc] = React.useState('');
  const [uploadingCatId, setUploadingCatId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCatalogData(true);
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load catalog.');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.sku?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCategory && p.category_id !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await refreshCatalog();
      recordAuditLog('PRODUCT_DELETED', title, `Deleted product ID: ${id}`);
      toast.success(`Product "${title}" deleted from cloud catalog.`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete product.');
    }
  };

  const handleDuplicate = async (prod: Product) => {
    try {
      const created = await createProductApi({
        ...prod,
        id: undefined,
        title: `${prod.title} (Copy)`,
        slug: `${prod.slug}-copy-${Date.now().toString().slice(-4)}`,
        sku: `${prod.sku || 'MW'}-CPY-${Date.now().toString().slice(-4)}`,
      });
      setProducts((prev) => [created, ...prev]);
      await refreshCatalog();
      recordAuditLog('PRODUCT_DUPLICATED', created.title, `Duplicated from ${prod.title}`);
      toast.success(`Duplicated "${prod.title}".`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to duplicate product.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('No products in catalog to export.');
      return;
    }
    const headers = ['ID', 'Title', 'SKU', 'Category', 'Regular Price', 'Sale Price', 'Stock', 'Images'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.sku || '',
      `"${p.category_name || ''}"`,
      p.regular_price,
      p.sale_price || '',
      p.stock_quantity,
      p.images?.length || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mw_trends_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Product catalog CSV exported successfully!');
  };

  // Category Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error('Category name is required.');
      return;
    }
    setIsCreatingCat(true);
    try {
      const created = await createCategoryApi({
        name: newCatName.trim(),
        description: newCatDesc.trim() || `Personalized gifts under ${newCatName.trim()}`,
      });
      setCategories((prev) => [...prev, created]);
      setNewCatName('');
      setNewCatDesc('');
      await refreshCatalog();
      toast.success(`Category "${created.name}" created and synced across all devices!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create category.');
    } finally {
      setIsCreatingCat(false);
    }
  };

  const handleSaveCategoryEdit = async (id: string) => {
    if (!editCatName.trim()) return;
    try {
      const updated = await updateCategoryApi(id, {
        name: editCatName.trim(),
        description: editCatDesc.trim(),
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      setEditingCatId(null);
      await refreshCatalog();
      toast.success(`Category "${updated.name}" updated!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update category.');
    }
  };

  const handleUploadCategoryImage = async (catId: string, file: File) => {
    setUploadingCatId(catId);
    try {
      const publicUrl = await uploadImageToCloud(file, 'categories');
      const updated = await updateCategoryApi(catId, { image_url: publicUrl });
      setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, ...updated } : c)));
      await refreshCatalog();
      toast.success('Category cover image uploaded and synced!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload category image.');
    } finally {
      setUploadingCatId(null);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    const count = products.filter((p) => p.category_id === cat.id).length;
    if (count > 0) {
      toast.error(`Move or reassign the ${count} product(s) in "${cat.name}" before deleting.`);
      return;
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategoryApi(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      await refreshCatalog();
      toast.success(`Category "${cat.name}" deleted.`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete category.');
    }
  };

  const pendingPhotosCount = products.filter((p) => !p.images || p.images.length === 0).length;

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Cloud-Synced Catalog &amp; Categories
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            {activeTab === 'products' ? `Products (${products.length})` : `Categories (${categories.length})`}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface border border-border rounded-xl p-1">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'products' ? 'bg-gold text-black' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'categories' ? 'bg-gold text-black' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          {activeTab === 'products' && products.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5 text-gold" />
              <span>Export CSV</span>
            </Button>
          )}

          <Link href="/admin/products/new">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold uppercase tracking-wider text-xs">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      {activeTab === 'categories' ? (
        <div className="space-y-6">
          {/* Create Category Form */}
          <form
            onSubmit={handleCreateCategory}
            className="p-5 rounded-2xl bg-surface border border-border space-y-4 shadow-sm"
          >
            <h2 className="font-serif font-bold text-base text-text-primary flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gold" />
              <span>Create New Category</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <Input
                label="Category Name"
                placeholder="e.g. Gift Boxes"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
              <Input
                label="Short Description"
                placeholder="Brief tagline for category banner..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
              <Button type="submit" variant="gold" size="md" isLoading={isCreatingCat} className="gap-1.5 font-bold text-xs uppercase tracking-wider">
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </Button>
            </div>
          </form>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const prodCount = products.filter((p) => p.category_id === cat.id).length;
              const isEditing = editingCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-4 shadow-sm"
                >
                  <div className="relative w-20 h-20 rounded-xl bg-elevated border border-border overflow-hidden shrink-0 flex items-center justify-center">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/brand/monogram.svg"
                        alt={cat.name}
                        width={36}
                        height={36}
                        className="opacity-70"
                      />
                    )}
                    <label
                      className="absolute inset-x-0 bottom-0 bg-black/75 text-[10px] font-semibold text-gold text-center py-1 cursor-pointer hover:bg-black"
                      title="Upload Category Photo"
                    >
                      {uploadingCatId === cat.id ? 'Uploading...' : 'Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadCategoryImage(cat.id, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          placeholder="Category name"
                          className="h-9 text-xs"
                        />
                        <Input
                          value={editCatDesc}
                          onChange={(e) => setEditCatDesc(e.target.value)}
                          placeholder="Category description"
                          className="h-9 text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="gold" size="sm" onClick={() => handleSaveCategoryEdit(cat.id)} className="h-7 text-xs gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setEditingCatId(null)} className="h-7 text-xs gap-1">
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif font-bold text-base text-text-primary truncate">
                              {cat.name}
                            </h3>
                            <p className="text-[11px] text-text-muted line-clamp-2">
                              {cat.description || `/${cat.slug}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(cat.id);
                                setEditCatName(cat.name);
                                setEditCatDesc(cat.description || '');
                              }}
                              className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-elevated"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-elevated"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="gold" size="sm">
                            {prodCount} {prodCount === 1 ? 'Product' : 'Products'}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setActiveTab('products');
                            }}
                            className="text-[11px] text-text-secondary hover:text-gold underline"
                          >
                            View Products
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {pendingPhotosCount > 0 && (
            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-text-primary">
                <Upload className="w-4 h-4 text-gold shrink-0" />
                <span>
                  <strong className="text-gold">{pendingPhotosCount} product(s)</strong> need real product photos. Click the <strong>Edit</strong> icon on any product below to upload up to 6 photos — they will sync instantly to every phone and PC.
                </span>
              </div>
            </div>
          )}

          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <Input
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
            </div>

            <div className="w-full sm:w-64">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
          </div>

          {/* Products Data Table or Empty State */}
          {isLoading ? (
            <div className="rounded-2xl bg-surface border border-border p-12 text-center text-xs text-text-muted">
              Loading cloud catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                <PackageOpen className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-serif font-bold text-lg text-text-primary">
                  No Products Found
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  No products matched this search or category filter. Add your personalized cards, frames, mugs, pens, wallets, or jewelry anytime.
                </p>
              </div>
              <Link href="/admin/products/new" className="inline-block pt-2">
                <Button variant="gold" size="sm" className="gap-2 font-bold text-xs uppercase tracking-wider">
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>Product Title &amp; SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price (PKR)</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Customization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((prod) => (
                    <TableRow key={prod.id}>
                      <TableCell>
                        <Link href={`/admin/products/${prod.id}/edit`}>
                          <div className="relative w-12 h-12 rounded-lg bg-elevated overflow-hidden border border-border flex items-center justify-center">
                            {prod.images && prod.images[0]?.image_url ? (
                              <Image
                                src={prod.images[0].image_url}
                                alt={prod.title}
                                fill
                                unoptimized={prod.images[0].image_url?.startsWith('data:')}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[9px] font-semibold text-gold text-center px-1 leading-tight">
                                + Add Photo
                              </span>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <strong className="text-text-primary text-xs sm:text-sm font-semibold block line-clamp-1">
                          {prod.title}
                        </strong>
                        <span className="font-mono text-[11px] text-text-muted">
                          SKU: {prod.sku || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-text-secondary">
                          {categories.find((c) => c.id === prod.category_id)?.name || prod.category_name || 'Uncategorized'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-serif font-bold text-gold text-xs sm:text-sm block whitespace-nowrap">
                            {formatPKR(prod.sale_price || prod.regular_price)}
                          </span>
                          {prod.sale_price && (
                            <span className="text-[10px] text-text-muted line-through whitespace-nowrap">
                              {formatPKR(prod.regular_price)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {prod.stock_quantity <= 5 ? (
                          <Badge variant="danger" size="sm">
                            {prod.stock_quantity} Low
                          </Badge>
                        ) : (
                          <span className="text-xs font-mono font-medium text-text-primary">
                            {prod.stock_quantity}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {prod.has_customization ? (
                          <Badge variant="gold" size="sm">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Custom
                          </Badge>
                        ) : (
                          <span className="text-xs text-text-muted">Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gold/10 text-gold hover:bg-gold hover:text-black text-[11px] font-semibold transition-colors"
                            title="Edit Product / Upload Photos"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit / Photos</span>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(prod)}
                            title="Duplicate"
                            className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-elevated transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.title)}
                            title="Delete"
                            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-elevated transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
