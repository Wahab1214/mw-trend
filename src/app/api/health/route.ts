import { NextResponse } from 'next/server';
import { createAdminClient, getReadableSupabaseClient, hasServiceRoleKey } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceKey = hasServiceRoleKey();

  const sb = getReadableSupabaseClient();
  if (!sb) {
    return NextResponse.json(
      {
        ok: false,
        hasUrl,
        hasAnonKey,
        hasServiceKey,
        storageReady: false,
        error: 'Supabase environment variables are not configured on server.',
      },
      { status: 500 }
    );
  }

  const [{ count: categoriesCount, error: catErr }, { count: productsCount, error: prodErr }] =
    await Promise.all([
      sb.from('categories').select('*', { count: 'exact', head: true }),
      sb.from('products').select('*', { count: 'exact', head: true }),
    ]);

  let storageReady = false;
  const adminSb = createAdminClient();
  if (adminSb) {
    const { data: buckets } = await adminSb.storage.listBuckets();
    storageReady = Boolean(buckets?.some((b) => b.name === 'product-images'));
  }

  return NextResponse.json({
    ok: !catErr && !prodErr,
    hasUrl,
    hasAnonKey,
    hasServiceKey,
    storageReady,
    categoriesCount: categoriesCount ?? 0,
    productsCount: productsCount ?? 0,
    error: catErr?.message || prodErr?.message || null,
  });
}
