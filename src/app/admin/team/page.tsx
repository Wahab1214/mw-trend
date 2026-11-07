'use client';

import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast';
import { RoleType } from '@/types';
import { recordAuditLog } from '@/lib/audit';
import { ShieldCheck, Plus, UserPlus, Lock } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  lastActive: string;
}

export default function AdminTeamPage() {
  const toast = useToast();
  const [staff, setStaff] = React.useState<StaffMember[]>([
    {
      id: 'staff-owner-master',
      name: 'Wahab (Store Owner)',
      email: 'wmofficial11@gmail.com',
      role: 'owner',
      isActive: true,
      lastActive: 'Active Now',
    },
  ]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('mw_staff_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStaff([
          {
            id: 'staff-owner-master',
            name: 'Wahab (Store Owner)',
            email: 'wmofficial11@gmail.com',
            role: 'owner',
            isActive: true,
            lastActive: 'Active Now',
          },
          ...parsed,
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteName, setInviteName] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<RoleType>('manager');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    const newStaff: StaffMember = {
      id: `staff_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      isActive: true,
      lastActive: 'Authorized',
    };

    setStaff((prev) => {
      const updated = [...prev, newStaff];
      try {
        const nonOwner = updated.filter((s) => s.id !== 'staff-owner-master');
        localStorage.setItem('mw_staff_members', JSON.stringify(nonOwner));
        recordAuditLog('STAFF_INVITED', inviteEmail, `Authorized staff member: ${inviteName} as ${inviteRole}`);
      } catch {
        // ignore
      }
      return updated;
    });

    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteName('');
    toast.success(`Staff authorization created for ${inviteEmail}! They can now log in with their email.`);
  };

  const permissionMatrix = [
    { module: 'Product Catalog Management', owner: true, admin: true, manager: true, handler: false, editor: true, viewer: false },
    { module: 'Orders Dispatch & Invoices', owner: true, admin: true, manager: true, handler: true, editor: false, viewer: true },
    { module: 'Payment Screenshot Verification', owner: true, admin: true, manager: true, handler: false, editor: false, viewer: false },
    { module: 'Marketing & Flash Sales', owner: true, admin: true, manager: false, handler: false, editor: true, viewer: false },
    { module: 'Store Settings & Bank Details', owner: true, admin: false, manager: false, handler: false, editor: false, viewer: false },
    { module: 'Team Staff & Role Permissions', owner: true, admin: false, manager: false, handler: false, editor: false, viewer: false },
  ];

  return (
    <div className="space-y-8 select-none max-w-5xl pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-text-primary">
            Team &amp; Permissions
          </h1>
        </div>

        <Button variant="gold" size="sm" onClick={() => setIsInviteModalOpen(true)} className="gap-1.5 font-bold uppercase tracking-wider text-xs">
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </Button>
      </div>

      {/* Staff Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <strong className="text-text-primary text-xs sm:text-sm font-semibold block">
                    {s.name}
                  </strong>
                  <span className="text-[11px] text-text-muted">{s.email}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-xs capitalize text-gold">
                    {s.role.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-text-secondary">
                    {s.role === 'owner' ? 'Full Unrestricted Access' : s.role === 'admin' ? 'Store & Catalog Admin' : s.role === 'order_handler' ? 'Packing & Tracking Only' : 'Content & SEO'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-text-muted">{s.lastActive}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={s.isActive ? 'success' : 'danger'}>
                    {s.isActive ? 'Active Staff' : 'Disabled'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Granular Permission Matrix */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-sm">
        <h3 className="font-serif font-bold text-base text-text-primary border-b border-border pb-2">
          Granular Permission Matrix
        </h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Order Handler</TableHead>
              <TableHead>Editor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissionMatrix.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-xs text-text-primary">{p.module}</TableCell>
                <TableCell><Badge variant={p.owner ? 'success' : 'default'} size="sm">{p.owner ? 'Allowed' : '-'}</Badge></TableCell>
                <TableCell><Badge variant={p.admin ? 'success' : 'default'} size="sm">{p.admin ? 'Allowed' : '-'}</Badge></TableCell>
                <TableCell><Badge variant={p.manager ? 'success' : 'default'} size="sm">{p.manager ? 'Allowed' : '-'}</Badge></TableCell>
                <TableCell><Badge variant={p.handler ? 'success' : 'default'} size="sm">{p.handler ? 'Allowed' : '-'}</Badge></TableCell>
                <TableCell><Badge variant={p.editor ? 'success' : 'default'} size="sm">{p.editor ? 'Allowed' : '-'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Staff Member" size="md">
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Staff Name"
            placeholder="e.g. Haris Mehmood"
            value={inviteName}
            required
            onChange={(e) => setInviteName(e.target.value)}
          />

          <Input
            type="email"
            label="Corporate / Staff Email"
            placeholder="staff@mwtrends.pk"
            value={inviteEmail}
            required
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <Select
            label="Assigned Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as RoleType)}
            options={[
              { value: 'admin', label: 'Admin (Catalog, Orders, Marketing)' },
              { value: 'manager', label: 'Store Manager' },
              { value: 'order_handler', label: 'Order Handler (Fulfillment & Courier)' },
              { value: 'editor', label: 'Content / SEO Editor' },
              { value: 'viewer', label: 'Viewer (Read-only Analytics)' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm">
              Send Staff Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
