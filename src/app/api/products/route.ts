import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getVerifiedAdminSession,
  isValidUuid,
  slugifyText,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

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
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ error: 'Product title is required.' }, { status: 400 });
    }

    const baseSlug = slugifyText(body.slug || title) || `product-${Date.now()}`;
    const { data: existingSlug } = await sb
      .from('products')
      .select('id, slug')
      .ilike('slug', `${baseSlug}%`);

    let finalSlug = baseSlug;
    if (existingSlug?.some((p: any) => p.slug === baseSlug)) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const payload = {
      title,
      slug: finalSlug,
      sku: body.sku ? String(body.sku).trim() : null,
      short_description: body.short_description ? String(body.short_description).trim() : null,
      description: String(body.description || title),
      category_id: isValidUuid(body.category_id) ? body.category_id : null,
      base_cost_price: Number(body.base_cost_price || 0),
      regular_price: Number(body.regular_price || 0),
      sale_price:
        body.sale_price !== undefined && body.sale_price !== null && body.sale_price !== ''
          ? Number(body.sale_price)
          : null,
      stock_quantity: Number(body.stock_quantity ?? 20),
      track_stock: body.track_stock !== false,
      is_published: body.is_published !== false,
      is_featured: Boolean(body.is_featured),
      is_trending: Boolean(body.is_trending),
      is_new: body.is_new !== false,
      allowed_payment_methods: Array.isArray(body.allowed_payment_methods)
        ? body.allowed_payment_methods
        : ['COD', 'JazzCash', 'Easypaisa', 'BankTransfer'],
      weight_kg: Number(body.weight_kg || 0.25),
      has_customization: Boolean(body.has_customization),
      custom_fields_schema: Array.isArray(body.custom_fields_schema)
        ? body.custom_fields_schema
        : [],
      mockup_type: body.mockup_type || null,
      allow_customer_upload: Boolean(body.allow_customer_upload),
      seo_title: body.seo_title || title,
      seo_description: body.seo_description || body.short_description || null,
      focus_keyword: body.focus_keyword || null,
      rating_average: 0,
      reviews_count: 0,
      sales_count: 0,
    };

    const { data: created, error } = await sb
      .from('products')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const imagesInput: any[] = Array.isArray(body.images) ? body.images : [];
    let insertedImages: any[] = [];
    if (imagesInput.length > 0) {
      const imageRows = imagesInput
        .filter((img) => img && img.image_url)
        .map((img, idx) => ({
          product_id: created.id,
          image_url: String(img.image_url),
          alt_text: img.alt_text ? String(img.alt_text) : title,
          sort_order: idx + 1,
          is_primary: Boolean(img.is_primary) || idx === 0,
        }));

      if (imageRows.length > 0) {
        const { data: imgData, error: imgErr } = await sb
          .from('product_images')
          .insert(imageRows)
          .select('*');
        if (!imgErr && imgData) {
          insertedImages = imgData;
        }
      }
    }

    let categoryName: string | undefined;
    let categorySlug: string | undefined;
    if (created.category_id) {
      const { data: cat } = await sb
        .from('categories')
        .select('name, slug')
        .eq('id', created.category_id)
        .maybeSingle();
      categoryName = cat?.name;
      categorySlug = cat?.slug;
    }

    return NextResponse.json(
      {
        product: {
          ...created,
          category_name: categoryName,
          category_slug: categorySlug,
          images: insertedImages,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to create product.' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
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

  await sb.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await sb
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
