'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { History, ShieldCheck, Trash2 } from 'lucide-react';
import { AuditEntry } from '@/lib/audit';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditEntry[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_admin_audit_logs');
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    }
  }, []);

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all recorded activity logs?')) {
      setLogs([]);
      try {
        localStorage.removeItem('mw_admin_audit_logs');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="space-y-6 select-none max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Security &amp; Compliance Audit Trail</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Activity Logs ({logs.length})
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time immutable audit trail recording administrative modifications and status updates.
          </p>
        </div>

        {logs.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearLogs} className="gap-1.5 text-xs text-text-muted hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </Button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif font-bold text-lg text-text-primary">
              No Activity Logs Recorded Yet
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Administrative actions taken by store staff (such as adding or modifying products, updating order statuses, or saving store settings) will be automatically recorded here in real time.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Staff Member</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target Entity</TableHead>
                <TableHead>Modification Summary</TableHead>
                <TableHead>IP / Session</TableHead>
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
      )}
    </div>
  );
}
