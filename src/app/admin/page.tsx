'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { INITIAL_ORDERS, INITIAL_PRODUCTS } from '@/lib/mock-data';
import { formatPKR, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = React.useState('month');

  // Chart Data: Sales trend over time in PKR
  const salesOverTimeData = [
    { date: 'Oct 28', sales: 18500, profit: 8900 },
    { date: 'Oct 30', sales: 24200, profit: 11400 },
    { date: 'Nov 01', sales: 31000, profit: 15200 },
    { date: 'Nov 02', sales: 28400, profit: 13900 },
    { date: 'Nov 03', sales: 39800, profit: 19800 },
    { date: 'Nov 04', sales: 44500, profit: 22100 },
    { date: 'Nov 05', sales: 52000, profit: 26400 },
  ];

  // Acquisition Sources data
  const acquisitionSourceData = [
    { name: 'Website Direct', value: 48, color: '#C9A44C' },
    { name: 'WhatsApp Catalog', value: 26, color: '#25D366' },
    { name: 'Instagram Ads', value: 16, color: '#E1306C' },
    { name: 'Facebook Store', value: 7, color: '#1877F2' },
    { name: 'TikTok', value: 3, color: '#FE2C55' },
  ];

  // Orders by Status
  const ordersStatusData = [
    { status: 'New', count: 12 },
    { status: 'Confirmed', count: 18 },
    { status: 'In Production', count: 24 },
    { status: 'Shipped', count: 32 },
    { status: 'Delivered', count: 85 },
  ];

  // Low stock products
  const lowStockProducts = INITIAL_PRODUCTS.filter(
    (p) => p.stock_quantity <= (p.low_stock_threshold || 10)
  );

  // Pending payments (orders awaiting screenshot verification)
  const pendingPaymentOrders = INITIAL_ORDERS.filter(
    (o) => o.payment_status === 'pending' || o.payment_method !== 'COD'
  );

  return (
    <div className="space-y-8 select-none">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Executive Performance Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Store Analytics &amp; Operations
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'today', label: 'Today (Live)' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'This Month (Nov 2026)' },
              { value: 'year', label: 'Year to Date' },
            ]}
          />
          <Link href="/admin/orders/new">
            <Button variant="gold" size="sm" className="font-bold whitespace-nowrap">
              + Create Manual Order
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Total Gross Sales</span>
            <span className="p-2 rounded-xl bg-gold/15 text-gold">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-black text-gold">
            Rs. 438,400
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Net Profit (PKR)</span>
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-black text-emerald-500">
            Rs. 228,600
          </div>
          <div className="text-[11px] text-text-secondary">
            Profit Margin: <strong className="text-text-primary">52.1%</strong>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Total Orders Placed</span>
            <span className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-black text-text-primary">
            171 Orders
          </div>
          <div className="text-[11px] text-text-secondary">
            Average Order Value: <strong className="text-gold">Rs. 2,563</strong>
          </div>
        </div>

        {/* Pending Action Verification */}
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-text-muted">
            <span>Pending Payment Proofs</span>
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="font-serif text-2xl font-black text-amber-500">
            {pendingPaymentOrders.length} Queued
          </div>
          <div className="text-[11px] text-text-muted">
            Awaiting JazzCash / Bank transfer checks
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Trend (Area Chart) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-text-primary">
                Revenue &amp; Net Profit Growth
              </h3>
              <p className="text-xs text-text-muted">Daily sales in PKR for the selected timeframe</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gold font-medium">
                <span className="w-3 h-3 rounded-full bg-gold inline-block" /> Sales
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Profit
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesOverTimeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#C9A44C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9A44C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#2E9D6B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2E9D6B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => `Rs.${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [formatPKR(Number(value)), 'Amount']}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#C9A44C" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="profit" stroke="#2E9D6B" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Acquisition Source (Pie Chart) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-text-primary">
              Orders by Acquisition Channel
            </h3>
            <p className="text-xs text-text-muted">Origin source of customer inquiries</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acquisitionSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {acquisitionSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {acquisitionSourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Low Stock Alerts & Pending Payment Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payment Queue */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Pending Manual Payment Verification</span>
            </div>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-border">
            {pendingPaymentOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-gold font-mono">{ord.order_number}</strong>
                    <span className="text-text-muted">({ord.customer_name})</span>
                  </div>
                  <span className="text-text-secondary block mt-0.5">
                    {ord.payment_method} • TID: <span className="font-mono font-bold text-text-primary">{ord.payment_proof?.transaction_id || 'Not entered yet'}</span>
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-serif font-bold text-text-primary block">
                    {formatPKR(ord.total_amount)}
                  </span>
                  <Link href={`/admin/orders/${ord.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      Review Proof
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Inventory Warning */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts</span>
            </div>
            <Link href="/admin/products" className="text-xs text-gold hover:underline">
              Manage Inventory
            </Link>
          </div>

          <div className="divide-y divide-border">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-text-primary block">{p.title}</strong>
                  <span className="text-text-muted">SKU: {p.sku}</span>
                </div>

                <div className="text-right">
                  <Badge variant="danger" size="sm">
                    {p.stock_quantity} left in stock
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-serif font-bold text-base text-text-primary">
            Recent Orders Dispatch Feed
          </h3>
          <Link href="/admin/orders" className="text-xs text-gold hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INITIAL_ORDERS.map((ord) => (
              <TableRow key={ord.id}>
                <TableCell className="font-mono font-bold text-gold">
                  {ord.order_number}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-text-primary block">{ord.customer_name}</span>
                  <span className="text-[10px] text-text-muted">{ord.customer_phone}</span>
                </TableCell>
                <TableCell>{ord.shipping_city}</TableCell>
                <TableCell>
                  <span className="font-semibold text-xs">{ord.payment_method}</span>
                </TableCell>
                <TableCell className="font-serif font-bold text-text-primary">
                  {formatPKR(ord.total_amount)}
                </TableCell>
                <TableCell className="font-serif text-emerald-500 font-bold">
                  {formatPKR(ord.net_profit)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={ord.status === 'Shipped' ? 'success' : ord.status === 'Delivered' ? 'success' : 'gold'}
                  >
                    {ord.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${ord.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Inspect
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
