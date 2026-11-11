import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getReadableSupabaseClient,
  getVerifiedAdminSession,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sb = getReadableSupabaseClient();
  if (!sb) {
    return NextResponse.json({ settings: null }, { status: 200 });
  }

  const { data, error } = await sb
    .from('store_settings')
    .select('*')
    .eq('id', 'global')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { settings: data },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function PUT(request: NextRequest) {
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
    const payload = {
      id: 'global',
      store_name: body.store_name || 'MW Trends',
      tagline: body.tagline || '',
      contact_phone: body.contact_phone || body.whatsapp_number || '+92 337 0566870',
      whatsapp_number: body.whatsapp_number || '+92 337 0566870',
      contact_email: body.contact_email || 'support@mwtrends.pk',
      store_address: body.store_address || 'Lahore, Pakistan',
      currency_code: body.currency_code || 'PKR',
      currency_symbol: body.currency_symbol || 'Rs.',
      instagram_url: body.instagram_url || null,
      facebook_url: body.facebook_url || null,
      tiktok_url: body.tiktok_url || null,
      payment_accounts: body.payment_accounts || {},
      flat_shipping_rate: Number(body.flat_shipping_rate ?? 200),
      free_shipping_threshold: Number(body.free_shipping_threshold ?? 3000),
      gift_wrap_price: Number(body.gift_wrap_price ?? 150),
      default_seo_title: body.default_seo_title || 'MW Trends',
      default_seo_description: body.default_seo_description || '',
      maintenance_mode: Boolean(body.maintenance_mode),
    };

    const { data, error } = await sb
      .from('store_settings')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Save failed.' }, { status: 400 });
  }
}
