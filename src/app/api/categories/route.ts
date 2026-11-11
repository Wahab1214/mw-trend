import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getReadableSupabaseClient,
  getVerifiedAdminSession,
  slugifyText,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = getReadableSupabaseClient();
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 500 });
  }

  const { data, error } = await sb
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories: data || [] });
}

export async function POST(request: NextRequest) {
  const admin = getVerifiedAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  }

  const sb = createAdminClient();
  if (!sb) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is missing on server.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const baseSlug = slugifyText(body.slug || name) || `category-${Date.now()}`;

    // Ensure unique slug if duplicate exists
    const { data: existing } = await sb
      .from('categories')
      .select('id, slug')
      .ilike('slug', `${baseSlug}%`);

    let finalSlug = baseSlug;
    if (existing?.some((c: any) => c.slug === baseSlug)) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const { data: maxSortRow } = await sb
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      name,
      slug: finalSlug,
      description: body.description ? String(body.description).trim() : null,
      image_url: body.image_url ? String(body.image_url).trim() : null,
      sort_order: Number(body.sort_order ?? ((maxSortRow?.sort_order || 0) + 1)),
      is_active: body.is_active !== false,
      is_featured: body.is_featured !== false,
    };

    const { data, error } = await sb.from('categories').insert(payload).select('*').single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Invalid category payload.' },
      { status: 400 }
    );
  }
}
