import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export interface AdminSessionPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const VALID_ADMIN_ROLES = new Set([
  'owner',
  'admin',
  'manager',
  'fulfillment',
  'support',
  'order_handler',
  'editor',
]);

export function hasServiceRoleKey(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return Boolean(url && serviceKey && !url.includes('placeholder'));
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !serviceKey || url.includes('placeholder')) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getReadableSupabaseClient() {
  const admin = createAdminClient();
  if (admin) return admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey || url.includes('placeholder')) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getVerifiedAdminSession(): AdminSessionPayload | null {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('mw_admin_session')?.value;
    if (!raw) return null;

    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as Partial<AdminSessionPayload>;
    if (!parsed || !parsed.email || !parsed.role) return null;
    if (!VALID_ADMIN_ROLES.has(String(parsed.role).toLowerCase())) return null;

    return {
      id: String(parsed.id || 'staff'),
      email: String(parsed.email).toLowerCase(),
      name: String(parsed.name || 'Admin'),
      role: String(parsed.role),
    };
  } catch {
    return null;
  }
}

export function isValidUuid(value?: string | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
