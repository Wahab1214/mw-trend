# Phase 2: Customer Design & File Upload Activation Guide

The MW Trends codebase is architecturally prepared for Phase 2: allowing customers to upload their own high-resolution artwork, company logos, vector files (SVG/PNG), and custom photos directly to Supabase Storage during product customization.

---

## 1. Architectural Readiness Overview

1. **Database Schema**: The `order_items` table already contains dedicated columns for customer file attachments:
   - `customer_upload_url TEXT`
   - `customer_upload_notes TEXT`
2. **Product Configuration**: The `products` table contains an `allow_customer_upload BOOLEAN DEFAULT false` column.
3. **Admin Switch**: The product creator form (`/admin/products/new`) includes a "Customer Design / File Upload (Phase 2)" toggle.
4. **Feature Flag**: Controlled by the `NEXT_PUBLIC_ENABLE_CUSTOMER_FILE_UPLOAD` environment variable.

---

## 2. Step-by-Step Activation Instructions

### Step 1: Create the Supabase Storage Bucket
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Storage** → Click **New Bucket**.
3. Bucket Name: `customer-designs`.
4. Check **Public Bucket** (or private with signed URLs).
5. Set File Size Limit: `10MB`.
6. Allowed MIME Types: `image/png, image/jpeg, image/svg+xml, application/pdf`.

### Step 2: Apply Storage RLS Policy
Run the following SQL in your Supabase SQL Editor:
```sql
-- Allow authenticated and guest users to upload designs to their order items
CREATE POLICY "Allow public customer uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'customer-designs');

-- Allow staff to view uploaded files
CREATE POLICY "Allow staff to view customer designs"
ON storage.objects FOR SELECT
USING (bucket_id = 'customer-designs');
```

### Step 3: Turn On the Feature Flag in Environment
In `.env.local` (and in your Vercel Project Settings):
```env
NEXT_PUBLIC_ENABLE_CUSTOMER_FILE_UPLOAD=true
```

### Step 4: Enable on Individual Products
1. In the MW Trends Admin panel, edit any product where you wish to accept customer artwork.
2. Toggle **Customer Design / File Upload (Phase 2)** to **ON**.
3. Save the product. The storefront customization section will now display an interactive drag-and-drop file uploader accepting PNG, SVG, or PDF files.
