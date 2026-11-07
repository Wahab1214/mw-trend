'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_CATEGORIES } from '@/lib/mock-data';
import { Product } from '@/types';
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
  PackageOpen
} from 'lucide-react';

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    }
  }, []);

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

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        try {
          localStorage.setItem('mw_trends_products', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
      recordAuditLog('PRODUCT_DELETED', title, `Deleted product SKU/ID: ${id}`);
      toast.success(`Product "${title}" deleted.`);
    }
  };

  const handleDuplicate = (prod: Product) => {
    const copy: Product = {
      ...prod,
      id: `prod_copy_${Date.now()}`,
      title: `${prod.title} (Copy)`,
      slug: `${prod.slug}-copy-${Date.now()}`,
    };
    setProducts((prev) => {
      const updated = [copy, ...prev];
      try {
        localStorage.setItem('mw_trends_products', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    recordAuditLog('PRODUCT_DUPLICATED', copy.title, `Duplicated from ${prod.title}`);
    toast.success(`Duplicated "${prod.title}".`);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL products from your catalog?')) {
      setProducts([]);
      try {
        localStorage.setItem('mw_trends_products', JSON.stringify([]));
      } catch {
        // ignore
      }
      recordAuditLog('CATALOG_CLEARED', 'All Products', 'Store owner wiped all products from store catalog');
      toast.info('All products cleared from catalog.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (products.length === 0) {
      toast.error('No products in catalog to export.');
      return;
    }
    const headers = ['ID', 'Title', 'SKU', 'Category', 'Regular Price', 'Sale Price', 'Stock', 'Customization'];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.sku || '',
      `"${p.category_name || ''}"`,
      p.regular_price,
      p.sale_price || '',
      p.stock_quantity,
      p.has_customization ? 'Yes' : 'No',
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

  return (
    <div className="space-y-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Catalog &amp; Inventory Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-1.5 text-xs text-text-muted hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Export CSV</span>
              </Button>
            </>
          )}

          <Link href="/admin/products/new">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold uppercase tracking-wider text-xs">
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>
      </div>

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

        <div className="w-full sm:w-56">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...INITIAL_CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
      </div>

      {/* Products Data Table or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif font-bold text-lg text-text-primary">
              No Products in Catalog
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your product catalog is currently empty. You can add your authentic personalized mugs, engraved pens, streetwear tees, or greeting cards whenever you want.
            </p>
          </div>
          <Link href="/admin/products/new" className="inline-block pt-2">
            <Button variant="gold" size="sm" className="gap-2 font-bold text-xs uppercase tracking-wider">
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
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
                    <div className="relative w-12 h-12 rounded-lg bg-elevated overflow-hidden border border-border">
                      {prod.images && prod.images[0] ? (
                        <Image
                          src={prod.images[0].image_url}
                          alt={prod.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">
                          No Img
                        </div>
                      )}
                    </div>
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
                    <span className="text-xs text-text-secondary">{prod.category_name}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-serif font-bold text-gold text-xs sm:text-sm block">
                        {formatPKR(prod.sale_price || prod.regular_price)}
                      </span>
                      {prod.sale_price && (
                        <span className="text-[10px] text-text-muted line-through">
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
                        Live 3D
                      </Badge>
                    ) : (
                      <span className="text-xs text-text-muted">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDuplicate(prod)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-elevated transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-elevated transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
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
    </div>
  );
}
