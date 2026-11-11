import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminClient,
  getVerifiedAdminSession,
  isValidUuid,
} from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
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

  const query = isValidUuid(params.id)
    ? sb.from('orders').select('*').eq('id', params.id).maybeSingle()
    : sb.from('orders').select('*').eq('order_number', params.id).maybeSingle();

  const { data: order, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  const [{ data: items }, { data: proof }] = await Promise.all([
    sb.from('order_items').select('*').eq('order_id', order.id),
    sb.from('payment_proofs').select('*').eq('order_id', order.id).maybeSingle(),
  ]);

  return NextResponse.json({
    order: {
      ...order,
      items: items || [],
      payment_proof: proof || undefined,
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

  const lookup = isValidUuid(params.id)
    ? sb.from('orders').select('*').eq('id', params.id).maybeSingle()
    : sb.from('orders').select('*').eq('order_number', params.id).maybeSingle();

  const { data: existing } = await lookup;
  if (!existing) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.status !== undefined) {
      updates.status = body.status;
      if (body.status === 'Shipped' && !existing.dispatched_at) {
        updates.dispatched_at = new Date().toISOString();
      }
      if (body.status === 'Delivered' && !existing.delivered_at) {
        updates.delivered_at = new Date().toISOString();
      }
    }
    if (body.payment_status !== undefined) updates.payment_status = body.payment_status;
    if (body.courier_name !== undefined) updates.courier_name = body.courier_name;
    if (body.tracking_number !== undefined) updates.tracking_number = body.tracking_number;
    if (body.courier_cost !== undefined) updates.courier_cost = Number(body.courier_cost);
    if (body.packaging_ad_expense !== undefined) {
      updates.packaging_ad_expense = Number(body.packaging_ad_expense);
    }
    if (body.net_profit !== undefined) updates.net_profit = Number(body.net_profit);
    if (body.profit_margin_percent !== undefined) {
      updates.profit_margin_percent = Number(body.profit_margin_percent);
    }
    if (body.internal_notes !== undefined) updates.internal_notes = body.internal_notes;

    const { data: updated, error } = await sb
      .from('orders')
      .update(updates)
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (body.status && body.status !== existing.status) {
      await sb.from('order_status_history').insert({
        order_id: existing.id,
        previous_status: existing.status,
        new_status: body.status,
        notes: `Updated by ${admin.name} (${admin.email})`,
      });
    }

    if (body.payment_status === 'verified' || body.payment_status === 'paid') {
      await sb
        .from('payment_proofs')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('order_id', existing.id);
    }

    const [{ data: items }, { data: proof }] = await Promise.all([
      sb.from('order_items').select('*').eq('order_id', updated.id),
      sb.from('payment_proofs').select('*').eq('order_id', updated.id).maybeSingle(),
    ]);

    return NextResponse.json({
      order: {
        ...updated,
        items: items || [],
        payment_proof: proof || undefined,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update failed.' }, { status: 400 });
  }
}
