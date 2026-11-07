'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/store/admin-auth-context';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Store, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAdminAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Helper to extract redirect URL safely
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r && r.startsWith('/admin') && r !== '/admin/login') {
        return r;
      }
    }
    return '/admin';
  };

  // On landing on the login page, always enforce a fresh login state
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mw_admin_auth_user');
        localStorage.removeItem('mw_admin_auth_user');
        localStorage.removeItem('mw_admin_session');
        document.cookie = 'mw_admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure;';
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        window.location.href = getRedirectUrl();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
      }
    } catch {
      setError('An unexpected error occurred during login.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F1E8] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[250px] bg-gold/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center gap-2 group text-xs text-[#A8A29A] hover:text-gold transition-colors">
          <Store className="w-4 h-4 text-gold transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Storefront</span>
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#2E2E2E] text-[11px] text-[#A8A29A]">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>Secure Staff Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto w-full my-auto relative z-10 py-8">
        <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {/* Brand Monogram */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-black border border-gold/40 flex items-center justify-center p-2.5 mx-auto mb-4 shadow-gold-glow">
              <Image
                src="/brand/monogram.svg"
                alt="MW Trends Logo"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-serif font-black text-2xl tracking-wider text-[#F5F1E8]">
              MW <span className="gold-gradient-text">TRENDS</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-gold font-semibold mt-1">
              Store Owner & Staff Studio
            </p>
            <p className="text-xs text-[#A8A29A] mt-2">
              Log in to manage orders, products, inventory, and profit metrics.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A8A29A] mb-1.5 uppercase tracking-wider">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6F6A63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mwtrends.pk"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1E8] placeholder:text-[#555] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#A8A29A] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6F6A63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-[#2E2E2E] rounded-xl pl-10 pr-11 py-2.5 text-sm text-[#F5F1E8] placeholder:text-[#555] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F6A63] hover:text-[#F5F1E8] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-sm tracking-wide shadow-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Enter Admin Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security footnote */}
          <div className="mt-6 pt-5 border-t border-[#222222] text-center">
            <p className="text-[11px] text-[#6F6A63] flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-gold/70" />
              <span>Role-Based Access Control (RBAC) Enabled</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#555555] py-2 relative z-10">
        MW Trends &copy; {new Date().getFullYear()} &bull; Pakistan&apos;s Premium Print-on-Demand & Custom Gifts
      </footer>
    </div>
  );
}
