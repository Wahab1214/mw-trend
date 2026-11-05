'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { History, ShieldCheck } from 'lucide-react';

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  ip: string;
}

export default function AdminAuditLogsPage() {
  const [logs] = React.useState<AuditEntry[]>([
    {
      id: 'log-1',
      user: 'owner@mwtrends.pk',
      action: 'ORDER_STATUS_UPDATE',
      entity: 'Order MW-001041',
      details: 'Status changed from "Confirmed" to "In Production"',
      timestamp: '2026-11-05T14:30:00Z',
      ip: '39.40.12.98 (Lahore)',
    },
    {
      id: 'log-2',
      user: 'tariq.admin@mwtrends.pk',
      action: 'PAYMENT_VERIFIED',
      entity: 'Order MW-001041',
      details: 'Approved JazzCash TID: JC9874561230 (Rs. 2,169)',
      timestamp: '2026-11-05T14:25:00Z',
      ip: '39.40.12.98 (Lahore)',
    },
    {
      id: 'log-3',
      user: 'owner@mwtrends.pk',
      action: 'PRODUCT_PRICE_UPDATE',
      entity: 'Royal Gold Monogram Mug',
      details: 'Sale price updated from Rs. 1,099 to Rs. 999',
      timestamp: '2026-11-05T11:15:00Z',
      ip: '39.40.12.98 (Lahore)',
    },
    {
      id: 'log-4',
      user: 'bilal.dispatch@mwtrends.pk',
      action: 'COURIER_ASSIGNED',
      entity: 'Order MW-001042',
      details: 'Assigned Call Courier tracking: CC-99001122',
      timestamp: '2026-11-04T16:45:00Z',
      ip: '182.180.44.12 (Lahore)',
    },
    {
      id: 'log-5',
      user: 'owner@mwtrends.pk',
      action: 'SETTINGS_UPDATE',
      entity: 'Store Settings',
      details: 'Free shipping threshold set to Rs. 3,000',
      timestamp: '2026-11-04T09:00:00Z',
      ip: '39.40.12.98 (Lahore)',
    },
  ]);

  return (
    <div className="space-y-6 select-none max-w-5xl">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider mb-1">
          <History className="w-3.5 h-3.5" />
          <span>Security &amp; Compliance Audit Trail</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
          Activity Logs ({logs.length})
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Immutable audit trail recording administrative modifications and status updates.
        </p>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Staff Member</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Modification Summary</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className="font-mono text-xs text-text-muted">
                    {formatDate(log.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <strong className="text-xs font-semibold text-text-primary block">
                    {log.user}
                  </strong>
                </TableCell>
                <TableCell>
                  <Badge variant="gold" size="sm">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-xs text-text-primary">{log.entity}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-text-secondary">{log.details}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[11px] text-text-muted">{log.ip}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
