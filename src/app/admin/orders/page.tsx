'use client';

import * as React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/mock-data';
import { Order, OrderStatus } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';
import {
  Search,
  Plus,
  Download,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Truck,
  Eye
} from 'lucide-react';

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [paymentFilter, setPaymentFilter] = React.useState<string>('');

  // Load real customer orders from storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_customer_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      const matchPhone = o.customer_phone.toLowerCase().includes(q);
      const matchCity = o.shipping_city.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
    }
    if (statusFilter && o.status !== statusFilter) return false;
    if (paymentFilter && o.payment_method !== paymentFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'City', 'Status', 'Payment Method', 'Subtotal', 'Shipping', 'Total', 'Profit'];
    const rows = orders.map((o) => [
      o.order_number,
      o.created_at,
      `"${o.customer_name}"`,
      o.customer_phone,
      `"${o.shipping_city}"`,
      o.status,
      o.payment_method,
      o.subtotal,
      o.shipping_fee,
      o.total_amount,
      o.net_profit,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mw_trends_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders CSV exported!');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Fulfillment &amp; Dispatch Desk
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Orders ({filteredOrders.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Export Orders CSV</span>
          </Button>

          <Link href="/admin/orders/new">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold uppercase tracking-wider text-xs">
              <Plus className="w-4 h-4" />
              <span>Manual Order</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
          <Input
            placeholder="Search Order #, customer name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Order Statuses' },
              { value: 'New', label: 'New / Unconfirmed' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'In Production', label: 'In Production (Printing)' },
              { value: 'Shipped', label: 'Shipped (In Transit)' },
              { value: 'Delivered', label: 'Delivered' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        <div>
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            options={[
              { value: '', label: 'All Payment Methods' },
              { value: 'COD', label: 'Cash on Delivery (COD)' },
              { value: 'JazzCash', label: 'JazzCash' },
              { value: 'Easypaisa', label: 'Easypaisa' },
              { value: 'BankTransfer', label: 'Bank Transfer' },
              { value: 'Card', label: 'Debit / Credit Card' },
            ]}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order # &amp; Date</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Method &amp; Status</TableHead>
              <TableHead>Total (PKR)</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Fulfillment</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-text-muted">
                      <Truck className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-text-primary">
                        {orders.length === 0 ? 'No Orders Received Yet' : 'No Matching Orders'}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {orders.length === 0
                          ? 'Your store is live and ready for customers. Orders placed on your website or via WhatsApp will appear here in real time.'
                          : 'No orders matched your search or filter criteria. Try clearing filters.'}
                      </p>
                    </div>
                    {orders.length === 0 && (
                      <Link href="/admin/orders/new">
                        <Button variant="gold" size="sm" className="mt-2 text-xs font-bold gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Manual Order</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((ord) => {
                const statusCfg = ORDER_STATUS_CONFIG[ord.status] || {
                  label: ord.status,
                  color: 'text-text-primary',
                  bg: 'bg-elevated',
                };

                return (
                  <TableRow key={ord.id}>
                    <TableCell>
                      <strong className="font-mono text-gold font-bold text-xs sm:text-sm block">
                        {ord.order_number}
                      </strong>
                      <span className="text-[10px] text-text-muted">
                        {formatDate(ord.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <strong className="text-xs font-semibold text-text-primary block">
                        {ord.customer_name}
                      </strong>
                      <span className="text-[10px] text-text-muted">{ord.customer_phone}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-text-primary">{ord.shipping_city}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-elevated font-semibold text-text-secondary border border-border">
                        {ord.order_source || 'Website'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold block">{ord.payment_method}</span>
                        <span className={`text-[10px] font-bold ${ord.payment_status === 'verified' || ord.payment_status === 'paid' ? 'text-status-success' : 'text-amber-500'}`}>
                          {ord.payment_status.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-serif font-bold text-text-primary text-xs sm:text-sm">
                        {formatPKR(ord.total_amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-serif font-bold text-emerald-500 text-xs sm:text-sm">
                        {formatPKR(ord.net_profit)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ord.status === 'Shipped' || ord.status === 'Delivered' ? 'success' : 'gold'}>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${ord.id}`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Eye className="w-3.5 h-3.5 text-gold" />
                          <span>Manage</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
