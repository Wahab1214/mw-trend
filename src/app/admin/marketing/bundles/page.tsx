'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { useCatalog } from '@/lib/store/catalog-context';
import { Bundle } from '@/types';
import { formatPKR } from '@/lib/utils';
import { Gift, Plus, Trash2 } from 'lucide-react';

export default function AdminBundlesPage() {
  const toast = useToast();
  const { products, refreshCatalog } = useCatalog();
  const [bundles, setBundles] = React.useState<Bundle[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [bundlePrice, setBundlePrice] = React.useState<number>(1999);
  const [compareAtPrice, setCompareAtPrice] = React.useState<number>(2500);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/marketing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.bundles)) setBundles(data.bundles);
      })
      .catch(() => {});
  }, []);

  const toggleProductSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Bundle title is required.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'bundle',
          title: title.trim(),
          description: description.trim(),
          bundle_price: Number(bundlePrice) || 0,
          compare_at_price: Number(compareAtPrice) || 0,
          item_product_ids: selectedIds,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create bundle.');

      setBundles((prev) => [data.bundle, ...prev]);
      await refreshCatalog();
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setSelectedIds([]);
      toast.success(`Combo "${data.bundle.title}" published across all devices!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save bundle.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string) => {
    const bundle = bundles.find((b) => b.id === id);
    if (!bundle) return;
    try {
      const res = await fetch('/api/marketing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: 'bundle', id, is_active: !bundle.is_active }),
      });
      if (!res.ok) throw new Error('Update failed');
      setBundles((prev) =>
        prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
      );
      await refreshCatalog();
      toast.success('Bundle status updated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update bundle.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gift bundle?')) return;
    try {
      const res = await fetch(`/api/marketing?entity=bundle&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setBundles((prev) => prev.filter((b) => b.id !== id));
      await refreshCatalog();
      toast.info('Bundle removed.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete bundle.');
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Custom Gift Combos &amp; Offers
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Curated Gift Combos &amp; Bundles ({bundles.length})
          </h1>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-1.5 font-bold uppercase tracking-wider text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Combo</span>
        </Button>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bundle Title</TableHead>
              <TableHead>Included Items</TableHead>
              <TableHead>Bundle Price</TableHead>
              <TableHead>Original Price</TableHead>
              <TableHead>Customer Savings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                    <Gift className="w-8 h-8 text-gold opacity-80" />
                    <p className="font-serif font-bold text-sm text-text-primary">No Gift Combos Created Yet</p>
                    <p className="text-xs text-text-muted">
                      Click &quot;New Combo&quot; whenever you want to launch a custom gift box or bundle deal.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bundles.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <strong className="text-xs sm:text-sm font-bold text-text-primary block">
                      {b.title}
                    </strong>
                    <span className="text-[11px] text-text-muted">/{b.slug}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-text-secondary">
                      {b.item_product_ids?.length || 0} Products Included
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-serif font-bold text-gold text-xs sm:text-sm">
                      {formatPKR(b.bundle_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs line-through text-text-muted">
                      {formatPKR(b.compare_at_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-500 text-xs">
                      Save {formatPKR(Math.max(0, b.compare_at_price - b.bundle_price))}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button type="button" onClick={() => toggleActive(b.id)}>
                      <Badge variant={b.is_active ? 'success' : 'default'}>
                        {b.is_active ? 'Active' : 'Draft'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-status-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Bundle Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Gift Combo / Bundle" size="md">
        <form onSubmit={handleCreateBundle} className="space-y-4">
          <Input
            label="Bundle Title"
            placeholder="e.g. Couple Gift Combo (Wallet + Love Card)"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="Describe what is included in this combo offer..."
            value={description}
            rows={2}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Combo Price (PKR)"
              value={bundlePrice}
              required
              onChange={(e) => setBundlePrice(Number(e.target.value))}
            />
            <Input
              type="number"
              label="Original Value (PKR)"
              value={compareAtPrice}
              required
              onChange={(e) => setCompareAtPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#A8A29A] uppercase tracking-wider">
              Select Products in This Bundle ({selectedIds.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-border bg-elevated/30">
              {products.map((prod) => (
                <label
                  key={prod.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-elevated cursor-pointer text-xs"
                >
                  <span className="truncate pr-2 text-text-primary">{prod.title}</span>
                  <Checkbox
                    checked={selectedIds.includes(prod.id)}
                    onChange={() => toggleProductSelection(prod.id)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSaving}>
              Publish Bundle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
