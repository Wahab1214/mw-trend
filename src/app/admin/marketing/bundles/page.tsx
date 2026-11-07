'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { INITIAL_BUNDLES } from '@/lib/mock-data';
import { formatPKR } from '@/lib/utils';
import { Gift, Plus, Trash2 } from 'lucide-react';

export default function AdminBundlesPage() {
  const toast = useToast();
  const [bundles, setBundles] = React.useState(INITIAL_BUNDLES);

  const toggleActive = (id: string) => {
    setBundles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b))
    );
    toast.success('Bundle status toggled.');
  };

  const handleDelete = (id: string) => {
    setBundles((prev) => prev.filter((b) => b.id !== id));
    toast.info('Bundle removed.');
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Average Order Value Boosters
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Curated Gift Combos &amp; Bundles ({bundles.length})
          </h1>
        </div>

        <Button variant="gold" size="sm" onClick={() => toast.info('Bundle creator modal active')} className="gap-1.5 font-bold uppercase tracking-wider text-xs">
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
                      Group products together into discounted gift bundles to boost your Average Order Value (AOV).
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
                    <span className="text-[11px] text-text-muted">Slug: /{b.slug}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-text-secondary">
                      {b.item_product_ids.length} Products Included
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
                      Save {formatPKR(b.compare_at_price - b.bundle_price)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? 'success' : 'default'}>
                      {b.is_active ? 'Active' : 'Draft'}
                    </Badge>
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
    </div>
  );
}
