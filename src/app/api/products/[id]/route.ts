import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getReadableSupabaseClient,
  getVerifiedAdminSession,
  isValidUuid,
  slugifyText,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getReadableSupabaseClient();
  if (!sb) {
    return NextResponse.json({ error: 'Database not configured.' }, { status: 500 });
  }

  const query = isValidUuid(params.id)
    ? sb.from('products').select('*').eq('id', params.id).maybeSingle()
    : sb.from('products').select('*').eq('slug', params.id).maybeSingle();

  const { data: product, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  const [{ data: images }, { data: category }] = await Promise.all([
    sb
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true }),
    product.category_id
      ? sb.from('categories').select('name, slug').eq('id', product.category_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    product: {
      ...product,
      base_cost_price: Number(product.base_cost_price || 0),
      regular_price: Number(product.regular_price || 0),
      sale_price:
        product.sale_price !== null && product.sale_price !== undefined
          ? Number(product.sale_price)
          : undefined,
      category_name: category?.name || undefined,
      category_slug: category?.slug || undefined,
      images: images || [],
    },
  });
}

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
    return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.slug !== undefined) updates.slug = slugifyText(String(body.slug));
    if (body.sku !== undefined) updates.sku = body.sku ? String(body.sku).trim() : null;
    if (body.short_description !== undefined) updates.short_description = body.short_description;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category_id !== undefined) {
      updates.category_id = isValidUuid(body.category_id) ? body.category_id : null;
    }
    if (body.base_cost_price !== undefined) updates.base_cost_price = Number(body.base_cost_price);
    if (body.regular_price !== undefined) updates.regular_price = Number(body.regular_price);
    if (body.sale_price !== undefined) {
      updates.sale_price =
        body.sale_price !== null && body.sale_price !== '' ? Number(body.sale_price) : null;
    }
    if (body.stock_quantity !== undefined) updates.stock_quantity = Number(body.stock_quantity);
    if (body.track_stock !== undefined) updates.track_stock = Boolean(body.track_stock);
    if (body.is_published !== undefined) updates.is_published = Boolean(body.is_published);
    if (body.is_featured !== undefined) updates.is_featured = Boolean(body.is_featured);
    if (body.is_trending !== undefined) updates.is_trending = Boolean(body.is_trending);
    if (body.is_new !== undefined) updates.is_new = Boolean(body.is_new);
    if (body.allowed_payment_methods !== undefined) {
      updates.allowed_payment_methods = body.allowed_payment_methods;
    }
    if (body.has_customization !== undefined) {
      updates.has_customization = Boolean(body.has_customization);
    }
    if (body.custom_fields_schema !== undefined) {
      updates.custom_fields_schema = body.custom_fields_schema;
    }
    if (body.mockup_type !== undefined) updates.mockup_type = body.mockup_type || null;
    if (body.allow_customer_upload !== undefined) {
      updates.allow_customer_upload = Boolean(body.allow_customer_upload);
    }
    if (body.seo_title !== undefined) updates.seo_title = body.seo_title;
    if (body.seo_description !== undefined) updates.seo_description = body.seo_description;
    if (body.focus_keyword !== undefined) updates.focus_keyword = body.focus_keyword;

    const { data: updated, error } = await sb
      .from('products')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let finalImages: any[] | undefined;
    if (Array.isArray(body.images)) {
      await sb.from('product_images').delete().eq('product_id', params.id);
      const imageRows = body.images
        .filter((img: any) => img && img.image_url)
        .map((img: any, idx: number) => ({
          product_id: params.id,
          image_url: String(img.image_url),
          alt_text: img.alt_text ? String(img.alt_text) : updated.title,
          sort_order: idx + 1,
          is_primary: Boolean(img.is_primary) || idx === 0,
        }));

      if (imageRows.length > 0) {
        const { data: imgData } = await sb
          .from('product_images')
          .insert(imageRows)
          .select('*');
        finalImages = imgData || [];
      } else {
        finalImages = [];
      }
    }

    if (finalImages === undefined) {
      const { data: imgData } = await sb
        .from('product_images')
        .select('*')
        .eq('product_id', params.id)
        .order('sort_order', { ascending: true });
      finalImages = imgData || [];
    }

    return NextResponse.json({
      product: {
        ...updated,
        images: finalImages,
      },
    });
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
    return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
  }

  const { error } = await sb.from('products').delete().eq('id', params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
