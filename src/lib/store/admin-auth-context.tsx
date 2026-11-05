'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'manager' | 'fulfillment' | 'support';
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = React.createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'mw_admin_auth_user';
export const MASTER_OWNER_EMAIL = 'wmofficial11@gmail.com';
export const ALLOWED_ADMIN_EMAILS = [
  'wmofficial11@gmail.com',
  'owner@mwtrends.pk',
  'admin@mwtrends.pk'
];

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Fallback to cookie check if available
        const match = typeof document !== 'undefined' ? document.cookie.match(/mw_admin_session=([^;]+)/) : null;
        if (match) {
          try {
            const cookieUser = JSON.parse(decodeURIComponent(match[1]));
            setUser(cookieUser);
          } catch {
            // Ignored
          }
        }
      }
    } catch {
      // Local storage unreadable or SSR
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email and password.' };
    }

    // STRICT OWNER & STAFF AUTHORIZATION CHECK
    let isAuthorized = ALLOWED_ADMIN_EMAILS.includes(cleanEmail);
    let assignedRole: 'owner' | 'manager' | 'fulfillment' | 'support' = 'owner';
    let staffName = cleanEmail === MASTER_OWNER_EMAIL ? 'Wahab (Owner)' : 'Store Owner';

    // Also check if this email is an invited staff member
    try {
      if (typeof window !== 'undefined') {
        const staffList = localStorage.getItem('mw_staff_members');
        if (staffList) {
          const staff = JSON.parse(staffList);
          const match = staff.find((s: { email?: string; isActive?: boolean; role?: any; name?: string }) => 
            s.email?.toLowerCase() === cleanEmail && s.isActive !== false
          );
          if (match) {
            isAuthorized = true;
            assignedRole = match.role || 'manager';
            staffName = match.name || cleanEmail;
          }
        }
      }
    } catch {
      // Ignored
    }

    if (!isAuthorized) {
      setIsLoading(false);
      return {
        success: false,
        error: `Access Denied: "${cleanEmail}" is not authorized. Only the verified store owner (${MASTER_OWNER_EMAIL}) and authorized team members can access Admin Studio.`,
      };
    }

    // Password validation (minimum 6 characters or standard master pass)
    const isCorrectPass = cleanPass === 'MWTrends@2026' || cleanPass.length >= 6;

    if (!isCorrectPass) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid password. Password must be at least 6 characters.',
      };
    }

    const loggedUser: AdminUser = {
      id: cleanEmail === MASTER_OWNER_EMAIL ? 'usr_owner_master' : 'usr_staff_' + Date.now(),
      email: cleanEmail,
      name: staffName,
      role: assignedRole,
    };

    setUser(loggedUser);
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(loggedUser));
      // Set HTTP cookie for Next.js edge middleware protection (7 days session)
      document.cookie = `mw_admin_session=${encodeURIComponent(JSON.stringify(loggedUser))}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // Ignored
    }

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      document.cookie = 'mw_admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch {
      // Ignored
    }
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = React.useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
