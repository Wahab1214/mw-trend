'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { INITIAL_FLASH_SALE } from '@/lib/mock-data';
import { recordAuditLog } from '@/lib/audit';
import { Flame, Clock, Plus } from 'lucide-react';

export default function AdminFlashSalesPage() {
  const toast = useToast();
  const [sale, setSale] = React.useState(INITIAL_FLASH_SALE);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_flash_sale');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSale(parsed);
        setIsActive(parsed.is_active || false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    const updated = { ...sale, is_active: checked };
    setSale(updated);
    try {
      localStorage.setItem('mw_trends_flash_sale', JSON.stringify(updated));
      recordAuditLog('FLASH_SALE_TOGGLED', sale.title, checked ? 'Enabled flash sale' : 'Disabled flash sale');
    } catch {
      // ignore
    }
    toast.success(checked ? 'Flash sale enabled and active on storefront.' : 'Flash sale disabled.');
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
          Urgency &amp; High-Conversion Sales
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
                {sale.title}
              </h3>
              <p className="text-xs text-text-muted">Slug: /{sale.slug}</p>
            </div>
          </div>

          <Switch
            label="Live on Storefront"
            checked={isActive}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Campaign Title"
            value={sale.title}
            onChange={(e) => setSale({ ...sale, title: e.target.value })}
          />
          <Input
            label="Description"
            value={sale.description || ''}
            onChange={(e) => setSale({ ...sale, description: e.target.value })}
          />
        </div>

        <div className="p-4 rounded-xl bg-elevated/40 border border-border space-y-3 text-xs">
          <span className="font-bold text-text-primary block">Active Flash Sale Discount Items:</span>
          <div className="space-y-2">
            {sale.items?.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border">
                <span className="font-medium text-text-primary">Product ID: {it.product_id}</span>
                <span className="font-serif font-bold text-gold">Flash Price: Rs. {it.flash_price}</span>
                <Badge variant="success" size="sm">{it.sold_count} Sold</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="gold" size="sm" onClick={() => toast.success('Flash sale schedule saved!')}>
            Save Flash Sale Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
