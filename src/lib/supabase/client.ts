import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Safe fallback if not configured yet
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
