export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
  ip: string;
}

export function recordAuditLog(
  action: string,
  entity: string,
  details: string,
  user = 'wmofficial11@gmail.com (Owner)'
) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('mw_admin_audit_logs');
    const list: AuditEntry[] = stored ? JSON.parse(stored) : [];
    const newEntry: AuditEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user,
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
      ip: 'Studio Web Session',
    };
    localStorage.setItem('mw_admin_audit_logs', JSON.stringify([newEntry, ...list].slice(0, 100)));
  } catch {
    // ignore
  }
}
