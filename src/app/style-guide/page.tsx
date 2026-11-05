'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Modal } from '@/components/ui/modal';
import { Drawer } from '@/components/ui/drawer';
import { Tabs } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { Rating } from '@/components/ui/rating';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/components/ui/toast';
import { Sparkles, Layers, Palette } from 'lucide-react';

export default function StyleGuidePage() {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [switchState, setSwitchState] = React.useState(true);
  const [checkboxState, setCheckboxState] = React.useState(true);
  const [quantity, setQuantity] = React.useState(2);
  const [interactiveRating, setInteractiveRating] = React.useState(4);
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none space-y-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>MW Trends UI Design System</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-text-primary">
            Component Style Guide
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Standardized reusable design tokens and interactive primitives for Dark &amp; Light themes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-xs text-text-muted font-medium">Toggle Theme</span>
        </div>
      </div>

      {/* 1. BUTTONS */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Buttons &amp; Variants
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary Gold</Button>
          <Button variant="gold">Gold Shimmer CTA</Button>
          <Button variant="secondary">Secondary Elevated</Button>
          <Button variant="outline">Outline Border</Button>
          <Button variant="ghost">Ghost Transparent</Button>
          <Button variant="danger">Danger Red</Button>
          <Button variant="primary" isLoading>Loading State</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button size="sm">Small (sm)</Button>
          <Button size="md">Medium (md)</Button>
          <Button size="lg">Large (lg)</Button>
        </div>
      </section>

      {/* 2. TOAST NOTIFICATIONS */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => toast.success('Mug added to shopping bag!', 'Success')}>
            Trigger Success Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.error('Payment verification failed.', 'Error')}>
            Trigger Error Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info('Courier tracking number updated.')}>
            Trigger Info Toast
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.warning('Low stock alert: Only 2 left.', 'Warning')}>
            Trigger Warning Toast
          </Button>
        </div>
      </section>

      {/* 3. FORM INPUTS & SELECTS */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-6 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Form Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Default Input" placeholder="Type here..." helperText="Standard helper note" />
          <Input label="Error State Input" placeholder="Wrong value" error="Invalid phone format entered" />
          <Select
            label="Dropdown Select"
            options={[
              { value: 'opt1', label: 'Playfair Serif Font' },
              { value: 'opt2', label: 'Signature Script' },
              { value: 'opt3', label: 'Gothic Bold' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea label="Textarea With Character Counter" placeholder="Write custom greeting message..." charLimit={100} />
          <div className="space-y-4 pt-2">
            <Checkbox
              label="Checkbox Primitive"
              description="With optional sub-description label"
              checked={checkboxState}
              onChange={(e) => setCheckboxState(e.target.checked)}
            />
            <Switch
              label="Switch Primitive Toggle"
              description="Used for feature flags and settings"
              checked={switchState}
              onCheckedChange={setSwitchState}
            />
          </div>
        </div>
      </section>

      {/* 4. BADGES & PRICE PRIMITIVES */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Badges, Prices &amp; Rating
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="gold">Gold Foil</Badge>
          <Badge variant="default">Default Gray</Badge>
          <Badge variant="success">Verified Buyer</Badge>
          <Badge variant="warning">Only 3 Left</Badge>
          <Badge variant="danger">Discontinued</Badge>
          <Badge variant="pink">Love Collection</Badge>
          <Badge variant="lavender">Friendship Day</Badge>
        </div>

        <div className="flex items-center gap-6 pt-3 flex-wrap">
          <Price price={1299} salePrice={999} size="sm" />
          <Price price={1499} salePrice={1199} size="md" />
          <Price price={2499} salePrice={1899} size="lg" />
          <Price price={3999} salePrice={2999} size="xl" />
        </div>

        <div className="flex items-center gap-6 pt-3">
          <div>
            <span className="text-xs text-text-muted block mb-1">Interactive Rating Stepper:</span>
            <Rating value={interactiveRating} interactive onChange={setInteractiveRating} size="md" count={42} />
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">Quantity Stepper:</span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>
        </div>
      </section>

      {/* 5. MODAL & DRAWER TRIGGERS */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Modals &amp; Slide-Out Drawers
        </h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            Open Sample Modal
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(true)}>
            Open Sample Drawer
          </Button>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Design Modal" description="Modal component overlay with smooth backdrop blur.">
          <p className="text-sm text-text-secondary leading-relaxed">
            This modal primitive handles keyboard escape listeners, body scroll locking, and accessible ARIA attributes.
          </p>
          <div className="mt-6 flex justify-end">
            <Button variant="gold" size="sm" onClick={() => setIsModalOpen(false)}>
              Close Modal
            </Button>
          </div>
        </Modal>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Sample Drawer Component">
          <p className="text-sm text-text-secondary leading-relaxed">
            Side drawer primitive used for the responsive cart bag, mobile filters, and admin navigation.
          </p>
          <div className="mt-6">
            <Button variant="gold" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Done
            </Button>
          </div>
        </Drawer>
      </section>

      {/* 6. TABLE COMPONENT */}
      <section className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-sm">
        <h2 className="font-serif font-bold text-lg text-text-primary border-b border-border pb-2">
          Data Table Primitive
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono font-bold text-gold">MW-001041</TableCell>
              <TableCell>Usman Ali (Islamabad)</TableCell>
              <TableCell>JazzCash</TableCell>
              <TableCell className="font-serif font-bold">Rs. 2,169</TableCell>
              <TableCell><Badge variant="gold">In Production</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono font-bold text-gold">MW-001042</TableCell>
              <TableCell>Fatima Noor (Lahore)</TableCell>
              <TableCell>COD</TableCell>
              <TableCell className="font-serif font-bold">Rs. 2,079</TableCell>
              <TableCell><Badge variant="success">Shipped</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination currentPage={currentPage} totalPages={4} onPageChange={setCurrentPage} />
      </section>
    </div>
  );
}
