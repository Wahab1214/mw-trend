import { NextRequest, NextResponse } from 'next/server';
import { getReadableSupabaseClient, getVerifiedAdminSession } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sb = getReadableSupabaseClient();
    if (!sb) {
      return NextResponse.json(
        { error: 'Database connection is not configured.' },
        { status: 500 }
      );
    }

    const includeUnpublished = request.nextUrl.searchParams.get('all') === 'true';
    const isAdmin = Boolean(getVerifiedAdminSession());

    let catQuery = sb.from('categories').select('*').order('sort_order', { ascending: true });
    let prodQuery = sb.from('products').select('*').order('created_at', { ascending: false });

    if (!includeUnpublished || !isAdmin) {
      catQuery = catQuery.eq('is_active', true);
      prodQuery = prodQuery.eq('is_published', true);
    }

    const [
      { data: categoriesData, error: catErr },
      { data: productsData, error: prodErr },
      { data: imagesData, error: imgErr },
      { data: settingsData },
      { data: flashSalesData },
      { data: bundlesData },
      { data: reviewsData },
    ] = await Promise.all([
      catQuery,
      prodQuery,
      sb.from('product_images').select('*').order('sort_order', { ascending: true }),
      sb.from('store_settings').select('*').eq('id', 'global').maybeSingle(),
      sb.from('flash_sales').select('*').order('created_at', { ascending: false }),
      sb.from('bundles').select('*').order('created_at', { ascending: false }),
      sb.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);

    if (catErr || prodErr || imgErr) {
      return NextResponse.json(
        { error: catErr?.message || prodErr?.message || imgErr?.message },
        { status: 500 }
      );
    }

    const categoriesRaw = categoriesData || [];
    const catById = new Map(categoriesRaw.map((c: any) => [c.id, c]));

    const imagesByProduct = new Map<string, any[]>();
    for (const img of imagesData || []) {
      const list = imagesByProduct.get(img.product_id) || [];
      list.push(img);
      imagesByProduct.set(img.product_id, list);
    }

    const productCountByCat = new Map<string, number>();

    const products = (productsData || []).map((p: any) => {
      const cat = p.category_id ? catById.get(p.category_id) : null;
      if (p.category_id && p.is_published) {
        productCountByCat.set(p.category_id, (productCountByCat.get(p.category_id) || 0) + 1);
      }

      const imgs = (imagesByProduct.get(p.id) || []).sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order || 0) - (b.sort_order || 0);
      });

      return {
        ...p,
        base_cost_price: Number(p.base_cost_price || 0),
        regular_price: Number(p.regular_price || 0),
        sale_price: p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : undefined,
        weight_kg: Number(p.weight_kg || 0.25),
        rating_average: Number(p.rating_average || 0),
        reviews_count: Number(p.reviews_count || 0),
        sales_count: Number(p.sales_count || 0),
        category_name: cat?.name || undefined,
        category_slug: cat?.slug || undefined,
        images: imgs,
      };
    });

    const categories = categoriesRaw.map((c: any) => ({
      ...c,
      product_count: productCountByCat.get(c.id) || 0,
    }));

    const activeFlashSale =
      (flashSalesData || []).find((f: any) => f.is_active) || null;
    const activeBundles = (bundlesData || []).filter((b: any) => b.is_active);
    const approvedReviews = (reviewsData || []).filter((r: any) => r.is_approved);

    return NextResponse.json(
      {
        categories,
        products,
        settings: settingsData || null,
        flashSale: activeFlashSale,
        bundles: activeBundles,
        reviews: approvedReviews,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch catalog.' },
      { status: 500 }
    );
  }
}
