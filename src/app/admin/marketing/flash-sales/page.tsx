'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useCatalog } from '@/lib/store/catalog-context';
import { INITIAL_FLASH_SALE } from '@/lib/mock-data';
import { recordAuditLog } from '@/lib/audit';
import { Flame } from 'lucide-react';

export default function AdminFlashSalesPage() {
  const toast = useToast();
  const { refreshCatalog } = useCatalog();
  const [sale, setSale] = React.useState(INITIAL_FLASH_SALE);
  const [isActive, setIsActive] = React.useState(false);
  const [durationHours, setDurationHours] = React.useState<number>(48);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/marketing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.flashSales) && data.flashSales.length > 0) {
          const latest = data.flashSales[0];
          setSale(latest);
          setIsActive(Boolean(latest.is_active));
        }
      })
      .catch(() => {});
  }, []);

  const persistFlashSale = async (nextActive: boolean) => {
    setIsSaving(true);
    try {
      const now = new Date();
      const end = new Date(now.getTime() + Math.max(1, durationHours) * 60 * 60 * 1000);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sale.id || '');

      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: 'flash_sale',
          ...(isUuid ? { id: sale.id } : {}),
          title: sale.title.trim() || 'Seasonal Sale Offer',
          description: sale.description || '',
          is_active: nextActive,
          start_datetime: now.toISOString(),
          end_datetime: end.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save flash sale.');

      if (data.flashSale) {
        setSale(data.flashSale);
        setIsActive(Boolean(data.flashSale.is_active));
      }
      await refreshCatalog();
      recordAuditLog(
        'FLASH_SALE_UPDATED',
        sale.title,
        nextActive ? 'Flash sale enabled on storefront' : 'Flash sale disabled'
      );
      toast.success(
        nextActive
          ? 'Flash sale enabled and synced across all devices!'
          : 'Flash sale paused & synced.'
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save flash sale settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    setSale((prev) => ({ ...prev, is_active: checked }));
    persistFlashSale(checked);
  };

  const handleSave = () => {
    persistFlashSale(isActive);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
          Urgency &amp; Sale Offers
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Flash Sales Manager
        </h1>
      </div>

      <div className="p-6 rounded-2xl bg-surface border border-gold/40 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-text-primary">
                {sale.title || 'Sale Campaign'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={isActive ? 'success' : 'default'} size="sm">
                  {isActive ? 'Live on Storefront' : 'Hidden'}
                </Badge>
              </div>
            </div>
          </div>

          <Switch
            label="Live on Storefront"
            checked={isActive}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Campaign Title"
            placeholder="e.g. Weekend Gift Sale"
            value={sale.title}
            onChange={(e) => setSale({ ...sale, title: e.target.value })}
          />
          <Input
            label="Offer Tagline / Description"
            placeholder="e.g. Flat 15% off or free gift wrap"
            value={sale.description || ''}
            onChange={(e) => setSale({ ...sale, description: e.target.value })}
          />
          <Input
            type="number"
            label="Countdown Duration (Hours)"
            min={1}
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="gold" size="sm" onClick={handleSave} isLoading={isSaving}>
            Save Flash Sale Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
