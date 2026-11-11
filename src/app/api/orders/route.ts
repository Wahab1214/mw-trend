import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getVerifiedAdminSession,
  isValidUuid,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
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

  const [{ data: orders, error: ordErr }, { data: items }, { data: proofs }] = await Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: false }),
    sb.from('order_items').select('*'),
    sb.from('payment_proofs').select('*').order('created_at', { ascending: false }),
  ]);

  if (ordErr) {
    return NextResponse.json({ error: ordErr.message }, { status: 500 });
  }

  const itemsByOrder = new Map<string, any[]>();
  for (const it of items || []) {
    const arr = itemsByOrder.get(it.order_id) || [];
    arr.push(it);
    itemsByOrder.set(it.order_id, arr);
  }

  const proofByOrder = new Map<string, any>();
  for (const p of proofs || []) {
    if (!proofByOrder.has(p.order_id)) {
      proofByOrder.set(p.order_id, p);
    }
  }

  const enriched = (orders || []).map((o: any) => ({
    ...o,
    subtotal: Number(o.subtotal || 0),
    discount_amount: Number(o.discount_amount || 0),
    shipping_fee: Number(o.shipping_fee || 0),
    gift_wrap_fee: Number(o.gift_wrap_fee || 0),
    total_amount: Number(o.total_amount || 0),
    total_cost_price: Number(o.total_cost_price || 0),
    courier_cost: Number(o.courier_cost || 0),
    packaging_ad_expense: Number(o.packaging_ad_expense || 0),
    net_profit: Number(o.net_profit || 0),
    profit_margin_percent: Number(o.profit_margin_percent || 0),
    items: itemsByOrder.get(o.id) || [],
    payment_proof: proofByOrder.get(o.id) || undefined,
  }));

  return NextResponse.json(
    { orders: enriched },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function POST(request: NextRequest) {
  const sb = createAdminClient();
  if (!sb) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is missing on server.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    const customerName = String(body.customer_name || '').trim();
    const customerPhone = String(body.customer_phone || '').trim();
    const shippingAddress = String(body.shipping_address || '').trim();
    const shippingCity = String(body.shipping_city || '').trim();

    if (!customerName || !customerPhone || !shippingAddress || !shippingCity) {
      return NextResponse.json(
        { error: 'Name, phone number, shipping address, and city are required.' },
        { status: 400 }
      );
    }

    const orderNumber =
      body.order_number || `MW-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderInsert = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: body.customer_email || null,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_province: body.shipping_province || 'Pakistan',
      order_notes: body.order_notes || null,
      order_source: body.order_source || 'Website',
      subtotal: Number(body.subtotal || 0),
      discount_amount: Number(body.discount_amount || 0),
      coupon_code: body.coupon_code || null,
      shipping_fee: Number(body.shipping_fee || 0),
      gift_wrap_fee: Number(body.gift_wrap_fee || 0),
      gift_message: body.gift_message || null,
      total_amount: Number(body.total_amount || 0),
      currency: 'PKR',
      total_cost_price: Number(body.total_cost_price || 0),
      courier_cost: Number(body.courier_cost ?? 180),
      packaging_ad_expense: Number(body.packaging_ad_expense ?? 100),
      net_profit: Number(body.net_profit || 0),
      profit_margin_percent: Number(body.profit_margin_percent || 0),
      status: body.status || 'New',
      payment_method: body.payment_method || 'COD',
      payment_status:
        body.payment_status || (body.payment_method === 'COD' ? 'pending' : 'pending_review'),
    };

    const { data: createdOrder, error: ordErr } = await sb
      .from('orders')
      .insert(orderInsert)
      .select('*')
      .single();

    if (ordErr) {
      return NextResponse.json({ error: ordErr.message }, { status: 500 });
    }

    const itemsInput: any[] = Array.isArray(body.items) ? body.items : [];
    let insertedItems: any[] = [];
    if (itemsInput.length > 0) {
      // Check valid product UUIDs existing in DB to avoid FK violations
      const candidateIds = itemsInput
        .map((i) => i.product_id)
        .filter((id) => isValidUuid(id));

      let validProductIds = new Set<string>();
      if (candidateIds.length > 0) {
        const { data: existingProds } = await sb
          .from('products')
          .select('id')
          .in('id', candidateIds);
        validProductIds = new Set((existingProds || []).map((p: any) => p.id));
      }

      const itemRows = itemsInput.map((it) => ({
        order_id: createdOrder.id,
        product_id: validProductIds.has(it.product_id) ? it.product_id : null,
        variant_id: isValidUuid(it.variant_id) ? it.variant_id : null,
        product_title: String(it.product_title || it.title || 'Custom Item'),
        variant_title: it.variant_title || null,
        sku: it.sku || null,
        product_image: it.product_image || it.image_url || null,
        unit_price: Number(it.unit_price || 0),
        unit_cost: Number(it.unit_cost || 0),
        quantity: Number(it.quantity || 1),
        line_total: Number(it.line_total ?? Number(it.unit_price || 0) * Number(it.quantity || 1)),
        customization_data: it.customization_data || null,
        customer_upload_url: it.customization_data?.customer_upload_url || it.customer_upload_url || null,
        customer_upload_notes: it.customer_upload_notes || null,
      }));

      const { data: itemsData, error: itemErr } = await sb
        .from('order_items')
        .insert(itemRows)
        .select('*');
      if (!itemErr && itemsData) {
        insertedItems = itemsData;
      }
    }

    let insertedProof: any = undefined;
    if (body.payment_proof && body.payment_proof.transaction_id) {
      const { data: proofData } = await sb
        .from('payment_proofs')
        .insert({
          order_id: createdOrder.id,
          payment_method: body.payment_proof.payment_method || createdOrder.payment_method,
          transaction_id: String(body.payment_proof.transaction_id),
          sender_account_name: body.payment_proof.sender_account_name || null,
          amount_paid: Number(body.payment_proof.amount_paid || createdOrder.total_amount),
          status: body.payment_proof.status || 'pending_review',
          proof_image_url: body.payment_proof.proof_image_url || null,
        })
        .select('*')
        .single();
      insertedProof = proofData || undefined;
    }

    return NextResponse.json(
      {
        order: {
          ...createdOrder,
          items: insertedItems,
          payment_proof: insertedProof,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to place order.' },
      { status: 400 }
    );
  }
}
