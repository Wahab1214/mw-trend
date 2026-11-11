import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getVerifiedAdminSession,
  isValidUuid,
  slugifyText,
} from '@/lib/supabase/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  if (!isValidUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid category ID.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.slug !== undefined) updates.slug = slugifyText(String(body.slug));
    if (body.description !== undefined) updates.description = body.description;
    if (body.image_url !== undefined) updates.image_url = body.image_url || null;
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (body.is_featured !== undefined) updates.is_featured = Boolean(body.is_featured);

    const { data, error } = await sb
      .from('categories')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ category: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update failed.' }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  if (!isValidUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid category ID.' }, { status: 400 });
  }

  // Unlink products referencing this category first so delete never fails on FK
  await sb.from('products').update({ category_id: null }).eq('category_id', params.id);

  const { error } = await sb.from('categories').delete().eq('id', params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
