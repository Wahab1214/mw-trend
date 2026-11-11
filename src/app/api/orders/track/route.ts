import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const orderNumber = (request.nextUrl.searchParams.get('orderNumber') || '').trim().toUpperCase();
  const phone = (request.nextUrl.searchParams.get('phone') || '').trim().replace(/[\s-]/g, '');

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number is required.' }, { status: 400 });
  }

  const sb = createAdminClient();
  if (!sb) {
    return NextResponse.json(
      { error: 'Order lookup service is unavailable right now.' },
      { status: 503 }
    );
  }

  const { data: order, error } = await sb
    .from('orders')
    .select(
      'id, order_number, customer_name, shipping_city, status, payment_method, payment_status, subtotal, discount_amount, shipping_fee, gift_wrap_fee, total_amount, courier_name, tracking_number, dispatched_at, delivered_at, created_at, customer_phone'
    )
    .ilike('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  if (phone) {
    const cleanStoredPhone = String(order.customer_phone || '').replace(/[\s-]/g, '');
    if (cleanStoredPhone && !cleanStoredPhone.endsWith(phone.slice(-7))) {
      return NextResponse.json({ error: 'Order number and phone number do not match.' }, { status: 404 });
    }
  }

  const { data: items } = await sb
    .from('order_items')
    .select('id, product_title, variant_title, quantity, unit_price, line_total, customization_data')
    .eq('order_id', order.id);

  // Return sanitized order without leaking raw full phone to arbitrary lookups unless queried carefully
  return NextResponse.json(
    {
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        shipping_city: order.shipping_city,
        status: order.status,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        subtotal: Number(order.subtotal || 0),
        discount_amount: Number(order.discount_amount || 0),
        shipping_fee: Number(order.shipping_fee || 0),
        gift_wrap_fee: Number(order.gift_wrap_fee || 0),
        total_amount: Number(order.total_amount || 0),
        courier_name: order.courier_name,
        tracking_number: order.tracking_number,
        created_at: order.created_at,
        items: items || [],
      },
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
