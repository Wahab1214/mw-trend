import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, getVerifiedAdminSession } from '@/lib/supabase/admin';

const ALLOWED_PUBLIC_FOLDERS = new Set(['customer-uploads', 'payment-proofs']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: NextRequest) {
  try {
    const sb = createAdminClient();
    if (!sb) {
      return NextResponse.json(
        {
          error:
            'Cloud storage is not configured on the server (missing SUPABASE_SERVICE_ROLE_KEY).',
        },
        { status: 503 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let mimeType = 'image/jpeg';
    let folder = 'products';
    let ext = 'jpg';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      folder = String(formData.get('folder') || 'products').replace(/[^a-z0-9-_]/gi, '');

      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
      }
      mimeType = file.type || 'image/jpeg';
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return NextResponse.json({ error: 'Unsupported image file format.' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be under 5MB.' }, { status: 400 });
      }
      buffer = Buffer.from(await file.arrayBuffer());
      ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    } else {
      const body = await request.json();
      folder = String(body.folder || 'products').replace(/[^a-z0-9-_]/gi, '');
      const dataUrl = String(body.dataUrl || '');
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (!match) {
        return NextResponse.json({ error: 'Invalid image payload.' }, { status: 400 });
      }
      mimeType = match[1];
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        return NextResponse.json({ error: 'Unsupported image format.' }, { status: 400 });
      }
      buffer = Buffer.from(match[2], 'base64');
      if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Image must be under 5MB.' }, { status: 400 });
      }
      ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    }

    if (!ALLOWED_PUBLIC_FOLDERS.has(folder)) {
      const admin = getVerifiedAdminSession();
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized upload attempt.' }, { status: 401 });
      }
    }

    // Ensure bucket exists cleanly
    const { data: buckets } = await sb.storage.listBuckets();
    if (!buckets?.some((b) => b.name === 'product-images')) {
      await sb.storage.createBucket('product-images', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      });
    }

    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadErr } = await sb.storage.from('product-images').upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
      cacheControl: '31536000',
    });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    const { data: publicUrlData } = sb.storage.from('product-images').getPublicUrl(filePath);
    return NextResponse.json({ url: publicUrlData.publicUrl, path: filePath });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
