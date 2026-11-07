'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { formatPKR, formatDate } from '@/lib/utils';
import { Search, UserX, UserCheck, MessageCircle, Users } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  isBlocked: boolean;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const toast = useToast();
  const [search, setSearch] = React.useState('');
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_trends_customer_orders');
      if (stored) {
        const orders = JSON.parse(stored);
        const customerMap: Record<string, Customer> = {};
        orders.forEach((o: any) => {
          const key = (o.customer_phone || o.customer_name || 'unknown').trim();
          if (!customerMap[key]) {
            customerMap[key] = {
              id: `cust_${key}`,
              name: o.customer_name || 'Anonymous Customer',
              phone: o.customer_phone || '',
              email: o.customer_email || 'Not provided',
              city: o.shipping_city || 'Pakistan',
              ordersCount: 0,
              totalSpent: 0,
              isBlocked: false,
              lastOrderDate: o.created_at,
            };
          }
          customerMap[key].ordersCount += 1;
          customerMap[key].totalSpent += (o.total_amount || 0);
          if (new Date(o.created_at) > new Date(customerMap[key].lastOrderDate)) {
            customerMap[key].lastOrderDate = o.created_at;
          }
        });
        setCustomers(Object.values(customerMap));
      }
    } catch {
      // ignore
    }
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (id: string, name: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
    );
    toast.info(`Updated customer status for "${name}".`);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="border-b border-border pb-5">
        <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
          Client Relationship Desk
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Customer Directory ({customers.length})
        </h1>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
        <Input
          placeholder="Search customer by name, phone, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 text-xs"
        />
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact / City</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Lifetime Spend</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-elevated border border-border flex items-center justify-center text-text-muted">
                      <Users className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-text-primary">
                        {customers.length === 0 ? 'No Customer Records Yet' : 'No Matching Customers'}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {customers.length === 0
                          ? 'Customer profiles, delivery addresses, and lifetime spending will automatically appear here as orders are placed.'
                          : 'No customer profiles match your search criteria.'}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <strong className="text-text-primary text-xs sm:text-sm font-semibold block">
                      {c.name}
                    </strong>
                    <span className="text-[11px] text-text-muted">{c.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs block text-text-primary">{c.phone}</span>
                    <span className="text-[11px] text-text-muted">{c.city}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs">{c.ordersCount} Orders</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-serif font-bold text-gold text-xs sm:text-sm">
                      {formatPKR(c.totalSpent)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-text-muted">{formatDate(c.lastOrderDate)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.isBlocked ? 'danger' : 'success'}>
                      {c.isBlocked ? 'Blocked (COD abuse)' : 'Active Customer'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://wa.me/${c.phone.replace(/[\s-]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-text-muted hover:text-[#25D366] hover:bg-elevated transition-colors"
                        title="WhatsApp Chat"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => toggleBlock(c.id, c.name)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.isBlocked
                            ? 'text-status-success hover:bg-elevated'
                            : 'text-text-muted hover:text-status-danger hover:bg-elevated'
                        }`}
                        title={c.isBlocked ? 'Unblock customer' : 'Block customer'}
                      >
                        {c.isBlocked ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                      </button>
                    </div>
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
