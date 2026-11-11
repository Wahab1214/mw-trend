'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Coupon } from '@/types';
import { recordAuditLog } from '@/lib/audit';
import { formatPKR } from '@/lib/utils';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/marketing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        }
      })
      .catch(() => {
        setCoupons([]);
      });
  }, []);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCode, setNewCode] = React.useState('');
  const [newType, setNewType] = React.useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [newValue, setNewValue] = React.useState<number>(10);
  const [minOrder, setMinOrder] = React.useState<number>(1500);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'coupon',
          code: newCode.trim().toUpperCase(),
          discount_type: newType,
          discount_value: newType === 'free_shipping' ? 0 : Number(newValue) || 0,
          min_order_value: Number(minOrder) || 0,
          per_user_limit: 1,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon.');

      const coupon = data.coupon;
      setCoupons((prev) => [coupon, ...prev]);
      recordAuditLog('COUPON_CREATED', coupon.code, `Created promotional coupon code: ${coupon.code}`);
      setIsModalOpen(false);
      setNewCode('');
      toast.success(`Coupon code "${coupon.code}" created & active across all devices!`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/marketing?entity=coupon&id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      recordAuditLog('COUPON_DELETED', code, `Deleted coupon code: ${code}`);
      toast.info(`Coupon "${code}" deleted.`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Promotions &amp; Discounts
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Coupon Codes ({coupons.length})
          </h1>
        </div>

        <Button variant="gold" size="sm" onClick={() => setIsModalOpen(true)} className="gap-1.5 font-bold uppercase tracking-wider text-xs">
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </Button>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coupon Code</TableHead>
              <TableHead>Discount Type</TableHead>
              <TableHead>Benefit</TableHead>
              <TableHead>Min. Order</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                    <Tag className="w-8 h-8 text-gold opacity-80" />
                    <p className="font-serif font-bold text-sm text-text-primary">No Active Coupon Codes</p>
                    <p className="text-xs text-text-muted">
                      Click &quot;New Coupon&quot; to create a discount promo code for your marketing campaigns.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((cp) => (
              <TableRow key={cp.id}>
                <TableCell>
                  <strong className="font-mono text-gold font-bold text-xs sm:text-sm block">
                    {cp.code}
                  </strong>
                  <span className="text-[11px] text-text-muted">{cp.description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold capitalize">{cp.discount_type.replace('_', ' ')}</span>
                </TableCell>
                <TableCell>
                  <strong className="text-xs font-bold text-text-primary">
                    {cp.discount_type === 'percentage'
                      ? `${cp.discount_value}% OFF`
                      : cp.discount_type === 'free_shipping'
                      ? 'Free Delivery'
                      : formatPKR(cp.discount_value)}
                  </strong>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-serif">{formatPKR(cp.min_order_value)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono font-bold text-text-primary">{cp.used_count} uses</span>
                </TableCell>
                <TableCell>
                  <Badge variant={cp.is_active ? 'success' : 'default'}>
                    {cp.is_active ? 'Active' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDelete(cp.id, cp.code)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-status-danger"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </div>

      {/* New Coupon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Coupon Code" size="md">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. FLASH20"
            value={newCode}
            required
            onChange={(e) => setNewCode(e.target.value)}
          />

          <Select
            label="Discount Type"
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            options={[
              { value: 'percentage', label: 'Percentage (%) Discount' },
              { value: 'fixed', label: 'Fixed Amount (PKR) Discount' },
              { value: 'free_shipping', label: 'Free Express Shipping' },
            ]}
          />

          {newType !== 'free_shipping' && (
            <Input
              type="number"
              label={newType === 'percentage' ? 'Percentage Value (%)' : 'Discount Amount (PKR)'}
              value={newValue}
              required
              onChange={(e) => setNewValue(Number(e.target.value))}
            />
          )}

          <Input
            type="number"
            label="Minimum Order Value (PKR)"
            value={minOrder}
            onChange={(e) => setMinOrder(Number(e.target.value))}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" isLoading={isSaving}>
              Save Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
