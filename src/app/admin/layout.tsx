'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/lib/store/admin-auth-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

function AdminProtectedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isLoginPage = pathname === '/admin/login';

  React.useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, isLoading, isLoginPage, router]);

  // If on login page, render clean standalone layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-text-primary gap-4">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-serif text-sm tracking-wider gold-gradient-text uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // If not logged in and redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminProtectedShell>{children}</AdminProtectedShell>
    </AdminAuthProvider>
  );
}
