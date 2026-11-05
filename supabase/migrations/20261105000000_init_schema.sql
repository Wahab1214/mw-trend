-- ==============================================================================
-- MW TRENDS — PRODUCTION DATABASE SCHEMA MIGRATION
-- Database: Supabase / PostgreSQL 15+
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 1. ROLES, PERMISSIONS & PROFILES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    phone VARCHAR(30),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'customer',
    is_blocked BOOLEAN DEFAULT false,
    notes TEXT,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    orders_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES, COLLECTIONS & OCCASIONS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    banner_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    seo_title VARCHAR(160),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_occasion BOOLEAN DEFAULT false, -- Valentine's, Eid, Birthday, etc.
    occasion_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(60) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS & VARIANTS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    short_description TEXT,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    
    -- Pricing & Profitability
    base_cost_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- for profit tracking
    regular_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(10, 2),
    
    -- Inventory
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_stock BOOLEAN DEFAULT true,
    
    -- Status & Badges
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    
    -- Payment & Shipping rules
    allowed_payment_methods JSONB NOT NULL DEFAULT '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb,
    weight_kg NUMERIC(6, 3) DEFAULT 0.250,
    
    -- Customization (Phase 1 & Phase 2)
    has_customization BOOLEAN DEFAULT false,
    custom_fields_schema JSONB DEFAULT '[]'::jsonb,
    mockup_template_url TEXT,
    mockup_type VARCHAR(50), -- 'mug', 'pen', 'tshirt', 'hoodie', 'cap', 'phone_case', 'card'
    allow_customer_upload BOOLEAN DEFAULT false, -- Phase 2 toggle (default false)
    
    -- SEO
    seo_title VARCHAR(160),
    seo_description VARCHAR(255),
    seo_keywords VARCHAR(255),
    focus_keyword VARCHAR(100),
    canonical_url TEXT,
    no_index BOOLEAN DEFAULT false,
    
    -- Aggregates
    rating_average NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- e.g. "Size: L / Color: Black"
    size VARCHAR(50),
    color VARCHAR(50),
    color_hex VARCHAR(20),
    sku VARCHAR(100) UNIQUE,
    price NUMERIC(10, 2), -- override regular price if set
    cost_price NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_tags (
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- ------------------------------------------------------------------------------
-- 4. ORDERS & ORDER ITEMS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. "MW-10024"
    idempotency_key VARCHAR(100) UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Customer Contact & Shipping Details
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(30) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_province VARCHAR(100) DEFAULT 'Pakistan',
    shipping_postal_code VARCHAR(20),
    order_notes TEXT,
    
    -- Acquisition / Origin
    order_source VARCHAR(50) DEFAULT 'Website', -- Website, WhatsApp, Facebook, Instagram, TikTok, Referral, Manual
    
    -- Financials (PKR)
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    coupon_code VARCHAR(50),
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gift_wrap_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gift_message TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'PKR',
    
    -- Profit & Expense Metrics
    total_cost_price NUMERIC(12, 2) DEFAULT 0.00,
    courier_cost NUMERIC(12, 2) DEFAULT 0.00,
    packaging_ad_expense NUMERIC(12, 2) DEFAULT 0.00,
    net_profit NUMERIC(12, 2) DEFAULT 0.00,
    profit_margin_percent NUMERIC(5, 2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- New, Confirmed, In Production, Shipped, Delivered, Cancelled, Returned
    payment_method VARCHAR(50) NOT NULL, -- COD, JazzCash, Easypaisa, BankTransfer, Card
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, verified, failed, refunded
    
    -- Courier & Dispatch
    courier_name VARCHAR(100), -- TCS, Leopards, Call Courier, Trax, Rider, M&P
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Internal Staff Notes
    internal_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    
    product_title VARCHAR(200) NOT NULL,
    variant_title VARCHAR(100),
    sku VARCHAR(100),
    product_image TEXT,
    
    unit_price NUMERIC(10, 2) NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 1,
    line_total NUMERIC(12, 2) NOT NULL,
    
    -- Customization payload (Name, message, font, color, etc.)
    customization_data JSONB DEFAULT '{}'::jsonb,
    
    -- Phase 2 Upload references (ready, feature flag controlled)
    customer_upload_url TEXT,
    customer_upload_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PAYMENT PROOFS (MANUAL VERIFICATION)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- JazzCash, Easypaisa, BankTransfer
    transaction_id VARCHAR(100) NOT NULL,
    sender_account_name VARCHAR(150),
    sender_phone_or_account VARCHAR(50),
    proof_image_url TEXT,
    amount_paid NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_review', -- pending_review, approved, rejected
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. MARKETING: COUPONS, FLASH SALES, BUNDLES, BANNERS
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
    discount_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    min_order_value NUMERIC(10, 2) DEFAULT 0.00,
    max_discount_amount NUMERIC(10, 2),
    usage_limit INTEGER,
    per_user_limit INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    applicable_category_ids JSONB DEFAULT '[]'::jsonb,
    applicable_product_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    discount_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flash_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE NOT NULL,
    description TEXT,
    banner_url TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flash_sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flash_sale_id UUID NOT NULL REFERENCES public.flash_sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    flash_price NUMERIC(10, 2) NOT NULL,
    stock_limit INTEGER,
    sold_count INTEGER DEFAULT 0,
    UNIQUE(flash_sale_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    bundle_price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    item_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    link_url TEXT,
    position VARCHAR(50) DEFAULT 'homepage_hero', -- 'announcement_top', 'homepage_hero', 'middle_promo'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. REVIEWS, WISHLISTS & USER ADDRESSES
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(150),
    comment TEXT NOT NULL,
    photo_urls JSONB DEFAULT '[]'::jsonb,
    is_verified_buyer BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home',
    recipient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) DEFAULT 'Pakistan',
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. SETTINGS, SHIPPING RULES, CONTACT MESSAGES & AUDIT
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.store_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'global',
    store_name VARCHAR(100) DEFAULT 'MW Trends',
    tagline VARCHAR(200) DEFAULT 'Premium Print-on-Demand & Personalized Gifts',
    contact_phone VARCHAR(50) DEFAULT '+92 300 1234567',
    whatsapp_number VARCHAR(50) DEFAULT '+92 300 1234567',
    contact_email VARCHAR(100) DEFAULT 'support@mwtrends.pk',
    store_address TEXT DEFAULT 'Lahore, Pakistan',
    currency_code VARCHAR(10) DEFAULT 'PKR',
    currency_symbol VARCHAR(10) DEFAULT 'Rs.',
    
    -- Social URLs
    instagram_url TEXT DEFAULT 'https://instagram.com/mwtrends',
    facebook_url TEXT DEFAULT 'https://facebook.com/mwtrends',
    tiktok_url TEXT DEFAULT 'https://tiktok.com/@mwtrends',
    
    -- Merchant Manual Payment Accounts
    payment_accounts JSONB DEFAULT '{
      "jazzcash": {"title": "MW Trends Official", "number": "03001234567", "instructions": "Send via JazzCash App or Till and enter TID."},
      "easypaisa": {"title": "MW Trends Official", "number": "03001234567", "instructions": "Send via Easypaisa App and upload receipt."},
      "bank": {"bank_name": "Meezan Bank Ltd", "account_title": "MW Trends", "account_number": "01020304050607", "iban": "PK12MEZN0001020304050607", "branch": "DHA Lahore"}
    }'::jsonb,
    
    -- Shipping defaults
    flat_shipping_rate NUMERIC(10, 2) DEFAULT 200.00,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 3000.00,
    gift_wrap_price NUMERIC(10, 2) DEFAULT 150.00,
    
    -- SEO Defaults
    default_seo_title VARCHAR(160) DEFAULT 'MW Trends | Premium Personalized Gifts & Print on Demand Pakistan',
    default_seo_description VARCHAR(255) DEFAULT 'Shop custom mugs, pens, shirts, hoodies, caps, phone cases, and cards in Pakistan. High quality print on demand with fast delivery & Cash on Delivery.',
    
    -- Maintenance
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.shipping_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(100) NOT NULL UNIQUE,
    shipping_fee NUMERIC(10, 2) NOT NULL,
    free_threshold NUMERIC(10, 2),
    estimated_days VARCHAR(50) DEFAULT '2-3 Business Days',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, read, replied
    staff_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL, -- e.g. "product.create", "order.status_update"
    entity_type VARCHAR(100) NOT NULL, -- "order", "product", "setting"
    entity_id VARCHAR(100),
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.custom_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    seo_title VARCHAR(160),
    seo_description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. TRIGGERS, ATOMIC FUNCTIONS & SEQUENCES
-- ------------------------------------------------------------------------------

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
          AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.%I', t);
        EXECUTE format('CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at()', t);
    END LOOP;
END;
$$;

-- Order Number Generator Sequence
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := 'MW-' || LPAD(nextval('public.order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_number();

-- Safe Atomic Stock Decrement on Order Confirmation / Creation
CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id UUID, p_variant_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    -- Decrement variant stock if specified
    IF p_variant_id IS NOT NULL THEN
        UPDATE public.product_variants
        SET stock_quantity = GREATEST(0, stock_quantity - p_quantity)
        WHERE id = p_variant_id;
    END IF;

    -- Decrement base product stock
    UPDATE public.products
    SET stock_quantity = GREATEST(0, stock_quantity - p_quantity),
        sales_count = sales_count + p_quantity
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin/staff privilege
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = uid AND role IN ('owner', 'admin', 'manager', 'order_handler', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ policies
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read active collections" ON public.collections FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (is_published = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public read product tags" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Public read active flash sales" ON public.flash_sales FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read flash sale items" ON public.flash_sale_items FOR SELECT USING (true);
CREATE POLICY "Public read active bundles" ON public.bundles FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Public read shipping rules" ON public.shipping_rules FOR SELECT USING (true);
CREATE POLICY "Public read published pages" ON public.custom_pages FOR SELECT USING (is_published = true OR public.is_admin_or_staff(auth.uid()));

-- Profile policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin_or_staff(auth.uid()));

-- Order policies (Users read own orders, guests insert via server action, admins read all)
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Order Items
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin_or_staff(auth.uid())))
);
CREATE POLICY "Allow insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Payment Proofs
CREATE POLICY "Users read own payment proofs" ON public.payment_proofs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payment_proofs.order_id AND (orders.user_id = auth.uid() OR public.is_admin_or_staff(auth.uid())))
);
CREATE POLICY "Allow insert payment proofs" ON public.payment_proofs FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff update payment proofs" ON public.payment_proofs FOR UPDATE USING (public.is_admin_or_staff(auth.uid()));

-- Wishlist
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);

-- Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Contact Messages
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff update contact messages" ON public.contact_messages FOR UPDATE USING (public.is_admin_or_staff(auth.uid()));

-- Audit Logs
CREATE POLICY "Staff read audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "System insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Admin full control on catalog & settings
CREATE POLICY "Staff manage categories" ON public.categories FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage collections" ON public.collections FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage tags" ON public.tags FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage products" ON public.products FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage product images" ON public.product_images FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage product variants" ON public.product_variants FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage coupons" ON public.coupons FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage flash sales" ON public.flash_sales FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage bundles" ON public.bundles FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage banners" ON public.banners FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage reviews" ON public.reviews FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage settings" ON public.store_settings FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage shipping rules" ON public.shipping_rules FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage custom pages" ON public.custom_pages FOR ALL USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Staff manage roles" ON public.roles FOR ALL USING (public.is_admin_or_staff(auth.uid()));
