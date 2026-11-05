'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast';
import { INITIAL_STORE_SETTINGS } from '@/lib/mock-data';
import { StoreSettings } from '@/types';
import { Store, ShieldCheck, Truck, Banknote, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = React.useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Store configuration and payment credentials updated successfully!');
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-8 select-none pb-12">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Storewide Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Store Settings
          </h1>
        </div>

        <Button type="submit" variant="gold" size="md" className="font-bold uppercase tracking-wider text-xs">
          Save All Settings
        </Button>
      </div>

      {/* 1. Brand & Contact */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2 flex items-center gap-2">
          <Store className="w-4 h-4 text-gold" />
          <span>Brand Identity &amp; Contact</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Store Display Name"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
          />
          <Input
            label="Brand Tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
          <Input
            label="WhatsApp Helpline Number"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
          />
          <Input
            label="Customer Support Email"
            value={settings.contact_email}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
          />
        </div>

        <Textarea
          label="Physical Studio Headquarters Address"
          value={settings.store_address}
          onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
        />
      </div>

      {/* 2. Manual Payment Credentials (Pakistan) */}
      <div className="p-6 rounded-2xl bg-surface border border-gold/40 space-y-5 shadow-sm">
        <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2 flex items-center gap-2">
          <Banknote className="w-4 h-4 text-gold" />
          <span>Manual Payment Accounts (Customer Transfer Details)</span>
        </h3>

        {/* JazzCash */}
        <div className="p-4 rounded-xl bg-elevated/40 border border-border space-y-3">
          <strong className="text-xs font-bold text-gold uppercase tracking-wider block">
            JazzCash Account
          </strong>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Account Title"
              value={settings.payment_accounts.jazzcash?.title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    jazzcash: { ...settings.payment_accounts.jazzcash!, title: e.target.value },
                  },
                })
              }
            />
            <Input
              label="Mobile Number"
              value={settings.payment_accounts.jazzcash?.number}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    jazzcash: { ...settings.payment_accounts.jazzcash!, number: e.target.value },
                  },
                })
              }
            />
            <Input
              label="Till ID (Optional)"
              value={settings.payment_accounts.jazzcash?.till_id || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    jazzcash: { ...settings.payment_accounts.jazzcash!, till_id: e.target.value },
                  },
                })
              }
            />
          </div>
        </div>

        {/* Easypaisa */}
        <div className="p-4 rounded-xl bg-elevated/40 border border-border space-y-3">
          <strong className="text-xs font-bold text-gold uppercase tracking-wider block">
            Easypaisa Mobile Account
          </strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Account Title"
              value={settings.payment_accounts.easypaisa?.title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    easypaisa: { ...settings.payment_accounts.easypaisa!, title: e.target.value },
                  },
                })
              }
            />
            <Input
              label="Mobile Number"
              value={settings.payment_accounts.easypaisa?.number}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    easypaisa: { ...settings.payment_accounts.easypaisa!, number: e.target.value },
                  },
                })
              }
            />
          </div>
        </div>

        {/* Meezan Bank */}
        <div className="p-4 rounded-xl bg-elevated/40 border border-border space-y-3">
          <strong className="text-xs font-bold text-gold uppercase tracking-wider block">
            Direct Bank Transfer (Meezan / Raast ID)
          </strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Bank Name"
              value={settings.payment_accounts.bank?.bank_name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    bank: { ...settings.payment_accounts.bank!, bank_name: e.target.value },
                  },
                })
              }
            />
            <Input
              label="Account Title"
              value={settings.payment_accounts.bank?.account_title}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    bank: { ...settings.payment_accounts.bank!, account_title: e.target.value },
                  },
                })
              }
            />
            <Input
              label="Account Number"
              value={settings.payment_accounts.bank?.account_number}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    bank: { ...settings.payment_accounts.bank!, account_number: e.target.value },
                  },
                })
              }
            />
            <Input
              label="IBAN"
              value={settings.payment_accounts.bank?.iban}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  payment_accounts: {
                    ...settings.payment_accounts,
                    bank: { ...settings.payment_accounts.bank!, iban: e.target.value },
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* 3. Shipping Rules */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2 flex items-center gap-2">
          <Truck className="w-4 h-4 text-gold" />
          <span>Nationwide Shipping Rates (PKR)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            type="number"
            label="Standard Flat Rate (PKR)"
            value={settings.flat_shipping_rate}
            onChange={(e) => setSettings({ ...settings, flat_shipping_rate: Number(e.target.value) })}
          />
          <Input
            type="number"
            label="Free Shipping Minimum Order (PKR)"
            value={settings.free_shipping_threshold}
            onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
          />
          <Input
            type="number"
            label="Luxury Gift Wrap Fee (PKR)"
            value={settings.gift_wrap_price}
            onChange={(e) => setSettings({ ...settings, gift_wrap_price: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* 4. Maintenance Mode */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif font-bold text-sm text-text-primary">Maintenance Mode</h4>
            <p className="text-xs text-text-muted">Temporarily display a maintenance landing page for customers</p>
          </div>
          <Switch
            checked={settings.maintenance_mode}
            onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
          />
        </div>
      </div>
    </form>
  );
}
