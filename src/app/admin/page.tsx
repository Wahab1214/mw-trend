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
import { useCatalog } from '@/lib/store/catalog-context';
import { fetchOrdersApi } from '@/lib/catalog-client';
import { Order } from '@/types';
import { formatPKR, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG } from '@/lib/constants';

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = React.useState('month');
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [healthWarning, setHealthWarning] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchOrdersApi()
      .then((list) => {
        if (Array.isArray(list)) setOrders(list);
      })
      .catch(() => {});
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.hasServiceKey === false) {
          setHealthWarning(
            'Vercel / Server environment is missing SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel Project Settings -> Environment Variables so admin product/category saves & image uploads sync to cloud.'
          );
        }
      })
      .catch(() => {});
  }, []);

  // Compute REAL Dynamic Metrics
  const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalProfit = orders.reduce((sum, o) => sum + (o.net_profit || 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
  const profitMarginPercent = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

  const pendingPaymentOrders = orders.filter(
    (o) => o.payment_status === 'pending' || (o.payment_method !== 'COD' && o.payment_status !== 'verified')
  );

  // Status breakdown from real orders
  const ordersStatusData = [
    { status: 'New', count: orders.filter((o) => o.status === 'New').length },
    { status: 'Confirmed', count: orders.filter((o) => o.status === 'Confirmed').length },
    { status: 'In Production', count: orders.filter((o) => o.status === 'In Production').length },
    { status: 'Shipped', count: orders.filter((o) => o.status === 'Shipped').length },
    { status: 'Delivered', count: orders.filter((o) => o.status === 'Delivered').length },
  ];

  // Acquisition source breakdown from real orders
  const websiteCount = orders.filter((o) => !o.order_source || o.order_source === 'Website').length;
  const whatsappCount = orders.filter((o) => o.order_source === 'WhatsApp').length;
  const instagramCount = orders.filter((o) => o.order_source === 'Instagram').length;
  const otherCount = Math.max(0, orders.length - (websiteCount + whatsappCount + instagramCount));

  const acquisitionSourceData = [
    { name: 'Website Direct', value: websiteCount || (orders.length === 0 ? 1 : 0), color: '#C9A44C' },
    { name: 'WhatsApp Catalog', value: whatsappCount, color: '#25D366' },
    { name: 'Instagram', value: instagramCount, color: '#E1306C' },
    { name: 'Direct / Call', value: otherCount, color: '#3B82C4' },
  ].filter((s) => s.value > 0);

  // Dynamic Sales Trend over time in PKR
  const salesOverTimeData = React.useMemo(() => {
    if (orders.length === 0) {
      return [
        { date: 'Mon', sales: 0, profit: 0 },
        { date: 'Tue', sales: 0, profit: 0 },
        { date: 'Wed', sales: 0, profit: 0 },
        { date: 'Thu', sales: 0, profit: 0 },
        { date: 'Fri', sales: 0, profit: 0 },
        { date: 'Sat', sales: 0, profit: 0 },
        { date: 'Sun', sales: 0, profit: 0 },
      ];
    }
    const daysMap: Record<string, { sales: number; profit: number }> = {};
    orders.forEach((o) => {
      const d = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!daysMap[d]) daysMap[d] = { sales: 0, profit: 0 };
      daysMap[d].sales += o.total_amount;
      daysMap[d].profit += (o.net_profit || 0);
    });
    return Object.keys(daysMap).map((k) => ({ date: k, sales: daysMap[k].sales, profit: daysMap[k].profit }));
  }, [orders]);

  const { products } = useCatalog();
  // Low stock products
  const lowStockProducts = products.filter(
    (p) => p.stock_quantity <= (p.low_stock_threshold || 5)
  );

  return (
    <div className="space-y-8 select-none">
      {healthWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-amber-200 block mb-0.5">Cloud Sync Setup Notice</strong>
            <span>{healthWarning}</span>
          </div>
        </div>
      )}
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
            {formatPKR(totalSales)}
          </div>
          <div className="text-[11px] text-text-muted flex items-center gap-1">
            <span>{totalOrdersCount > 0 ? `${totalOrdersCount} customer transaction(s)` : 'Awaiting first order'}</span>
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
            {formatPKR(totalProfit)}
          </div>
          <div className="text-[11px] text-text-secondary">
            Profit Margin: <strong className="text-text-primary">{profitMarginPercent}%</strong>
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
            {totalOrdersCount} {totalOrdersCount === 1 ? 'Order' : 'Orders'}
          </div>
          <div className="text-[11px] text-text-secondary">
            Average Order Value: <strong className="text-gold">{formatPKR(avgOrderValue)}</strong>
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
            Awaiting manual payment verification
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
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                    <ShoppingCart className="w-8 h-8 text-gold opacity-80" />
                    <p className="font-serif font-bold text-sm text-text-primary">No Customer Orders Yet</p>
                    <p className="text-xs text-text-muted">
                      Your store is live. Orders placed online or via WhatsApp will automatically update here in real time.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell className="font-mono font-bold text-gold text-xs">
                    {ord.order_number}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-text-primary block text-xs">{ord.customer_name}</span>
                    <span className="text-[10px] text-text-muted">{ord.customer_phone}</span>
                  </TableCell>
                  <TableCell className="text-xs">{ord.shipping_city}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs">{ord.payment_method}</span>
                  </TableCell>
                  <TableCell className="font-serif font-bold text-text-primary text-xs">
                    {formatPKR(ord.total_amount)}
                  </TableCell>
                  <TableCell className="font-serif text-emerald-500 font-bold text-xs">
                    {formatPKR(ord.net_profit || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ord.status === 'Shipped' || ord.status === 'Delivered' ? 'success' : 'gold'}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
