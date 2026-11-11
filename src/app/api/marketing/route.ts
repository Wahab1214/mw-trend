import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getReadableSupabaseClient,
  getVerifiedAdminSession,
  isValidUuid,
  slugifyText,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = getReadableSupabaseClient();
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 500 });
  }

  const isAdmin = Boolean(getVerifiedAdminSession());

  const [{ data: flashSales }, { data: bundles }, { data: reviews }, { data: coupons }] =
    await Promise.all([
      sb.from('flash_sales').select('*').order('created_at', { ascending: false }),
      sb.from('bundles').select('*').order('created_at', { ascending: false }),
      sb.from('reviews').select('*').order('created_at', { ascending: false }),
      isAdmin && createAdminClient()
        ? createAdminClient()!.from('coupons').select('*').order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

  return NextResponse.json(
    {
      flashSales: flashSales || [],
      bundles: bundles || [],
      reviews: reviews || [],
      coupons: coupons || [],
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Public coupon validation at checkout
    if (body.action === 'validate_coupon') {
      const sb = createAdminClient();
      if (!sb) {
        return NextResponse.json({ valid: false, error: 'Coupon verification unavailable.' });
      }
      const code = String(body.code || '').trim().toUpperCase();
      const subtotal = Number(body.subtotal || 0);
      const { data: coupon } = await sb
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .maybeSingle();

      if (!coupon) {
        return NextResponse.json({ valid: false, error: `Coupon "${code}" is invalid or expired.` });
      }
      if (subtotal < Number(coupon.min_order_value || 0)) {
        return NextResponse.json({
          valid: false,
          error: `Minimum order value of Rs. ${coupon.min_order_value} required for this coupon.`,
        });
      }
      return NextResponse.json({ valid: true, coupon });
    }

    // All other mutations require verified admin cookie
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

    if (body.entity === 'coupon') {
      const code = String(body.code || '').trim().toUpperCase();
      if (!code) return NextResponse.json({ error: 'Coupon code is required.' }, { status: 400 });

      const { data, error } = await sb
        .from('coupons')
        .insert({
          code,
          description: body.description || null,
          discount_type: body.discount_type || 'percentage',
          discount_value: Number(body.discount_value || 0),
          min_order_value: Number(body.min_order_value || 0),
          max_discount_amount: body.max_discount_amount ? Number(body.max_discount_amount) : null,
          usage_limit: body.usage_limit ? Number(body.usage_limit) : null,
          per_user_limit: Number(body.per_user_limit || 1),
          is_active: body.is_active !== false,
        })
        .select('*')
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ coupon: data }, { status: 201 });
    }

    if (body.entity === 'flash_sale') {
      const title = String(body.title || '').trim();
      if (!title) return NextResponse.json({ error: 'Flash sale title is required.' }, { status: 400 });
      const slug = slugifyText(body.slug || title) || `sale-${Date.now()}`;
      const now = new Date();
      const end = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      if (body.id && isValidUuid(body.id)) {
        const { data, error } = await sb
          .from('flash_sales')
          .update({
            title,
            description: body.description || '',
            is_active: Boolean(body.is_active),
            ...(body.start_datetime ? { start_datetime: body.start_datetime } : {}),
            ...(body.end_datetime ? { end_datetime: body.end_datetime } : {}),
          })
          .eq('id', body.id)
          .select('*')
          .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ flashSale: data });
      }

      const { data, error } = await sb
        .from('flash_sales')
        .insert({
          title,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          description: body.description || '',
          start_datetime: body.start_datetime || now.toISOString(),
          end_datetime: body.end_datetime || end.toISOString(),
          is_active: Boolean(body.is_active),
        })
        .select('*')
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ flashSale: data }, { status: 201 });
    }

    if (body.entity === 'bundle') {
      const title = String(body.title || '').trim();
      if (!title) return NextResponse.json({ error: 'Bundle title is required.' }, { status: 400 });
      const slug = `${slugifyText(title) || 'bundle'}-${Date.now().toString().slice(-4)}`;
      const { data, error } = await sb
        .from('bundles')
        .insert({
          title,
          slug,
          description: body.description || '',
          image_url: body.image_url || null,
          bundle_price: Number(body.bundle_price || 0),
          compare_at_price: Number(body.compare_at_price || 0),
          is_active: body.is_active !== false,
          item_product_ids: Array.isArray(body.item_product_ids) ? body.item_product_ids : [],
        })
        .select('*')
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ bundle: data }, { status: 201 });
    }

    return NextResponse.json({ error: 'Unknown marketing entity.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Operation failed.' }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { entity, id, ...fields } = body;
    if (!isValidUuid(id)) {
      return NextResponse.json({ error: 'Invalid ID.' }, { status: 400 });
    }

    const tableMap: Record<string, string> = {
      coupon: 'coupons',
      flash_sale: 'flash_sales',
      bundle: 'bundles',
      review: 'reviews',
    };
    const table = tableMap[entity];
    if (!table) {
      return NextResponse.json({ error: 'Invalid entity type.' }, { status: 400 });
    }

    const { data, error } = await sb
      .from(table)
      .update(fields)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update failed.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
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

  const entity = request.nextUrl.searchParams.get('entity') || '';
  const id = request.nextUrl.searchParams.get('id') || '';

  const tableMap: Record<string, string> = {
    coupon: 'coupons',
    flash_sale: 'flash_sales',
    bundle: 'bundles',
    review: 'reviews',
  };
  const table = tableMap[entity];
  if (!table || !isValidUuid(id)) {
    return NextResponse.json({ error: 'Invalid entity or ID.' }, { status: 400 });
  }

  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
