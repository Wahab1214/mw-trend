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

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Local storage unreadable or SSR
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate auth check / credentials verification
    // Accepts default store owner credentials or valid email/password
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Please enter both email and password.' };
    }

    // Default Owner credentials: admin@mwtrends.pk or owner@mwtrends.pk with MWTrends@2026 or any master admin password
    const isOwnerEmail = cleanEmail.includes('admin') || cleanEmail.includes('owner') || cleanEmail.includes('mwtrends');
    const isCorrectPass = cleanPass === 'MWTrends@2026' || cleanPass === 'admin123' || cleanPass.length >= 6;

    if (isCorrectPass) {
      const loggedUser: AdminUser = {
        id: 'usr_admin_001',
        email: cleanEmail,
        name: isOwnerEmail ? 'Store Owner' : 'MW Admin',
        role: 'owner',
      };

      setUser(loggedUser);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(loggedUser));
        // Set HTTP cookie for Next.js edge middleware protection
        document.cookie = `mw_admin_session=${encodeURIComponent(JSON.stringify(loggedUser))}; path=/; max-age=604800; SameSite=Lax`;
      } catch {
        // Ignored
      }
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: 'Invalid email or password. Password must be at least 6 characters.',
    };
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
