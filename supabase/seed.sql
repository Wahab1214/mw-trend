-- ==============================================================================
-- MW TRENDS — SEED SCRIPT (REALISTIC SAMPLE DATA FOR PAKISTAN E-COMMERCE)
-- ==============================================================================

-- 1. ROLES & PERMISSIONS
INSERT INTO public.roles (name, description, is_system, permissions) VALUES
('owner', 'Super Administrator with full unrestricted control', true, '["*"]'::jsonb),
('admin', 'Store Administrator for catalog, orders, and marketing', true, '["products.*", "orders.*", "customers.*", "marketing.*", "reviews.*", "settings.view"]'::jsonb),
('manager', 'Store Manager managing day-to-day operations and team', true, '["products.*", "orders.*", "customers.view", "marketing.view"]'::jsonb),
('order_handler', 'Fulfillment & Packing staff updating order status & tracking', true, '["orders.view", "orders.status_update", "orders.print"]'::jsonb),
('editor', 'Content & SEO Editor managing descriptions and banners', true, '["products.edit", "marketing.banners", "pages.*", "seo.*"]'::jsonb),
('viewer', 'Read-only analyst', true, '["*.view"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. STORE SETTINGS
INSERT INTO public.store_settings (
    id, store_name, tagline, contact_phone, whatsapp_number, contact_email, store_address, 
    currency_code, currency_symbol, flat_shipping_rate, free_shipping_threshold, gift_wrap_price,
    payment_accounts, instagram_url, facebook_url, tiktok_url
) VALUES (
    'global',
    'MW Trends',
    'Pakistan''s Premium Print-on-Demand & Personalized Gift Studio',
    '+92 300 1234567',
    '+92 300 1234567',
    'support@mwtrends.pk',
    'MW Trends Creative Studio, Gulberg III, Lahore, Pakistan',
    'PKR',
    'Rs.',
    250.00,
    3000.00,
    150.00,
    '{
        "jazzcash": {
            "title": "MW Trends PVT",
            "number": "03001234567",
            "till_id": "009988",
            "instructions": "Send exact amount to JazzCash Till 009988 or Mobile 03001234567. Save transaction receipt and upload screenshot with TID below."
        },
        "easypaisa": {
            "title": "MW Trends PVT",
            "number": "03001234567",
            "instructions": "Transfer via Easypaisa App to 03001234567. Enter Transaction ID (TID) and attach transfer screenshot."
        },
        "bank": {
            "bank_name": "Meezan Bank Limited",
            "account_title": "MW Trends E-Commerce",
            "account_number": "02190104882190",
            "iban": "PK54MEZN0002190104882190",
            "branch": "Main Boulevard Gulberg Branch, Lahore",
            "instructions": "Transfer via online banking / Raast ID. Upload bank transfer slip screenshot after order placement."
        }
    }'::jsonb,
    'https://instagram.com/mwtrends.pk',
    'https://facebook.com/mwtrendspk',
    'https://tiktok.com/@mwtrends.pk'
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    tagline = EXCLUDED.tagline,
    payment_accounts = EXCLUDED.payment_accounts;

-- 3. SHIPPING RULES
INSERT INTO public.shipping_rules (city_name, shipping_fee, free_threshold, estimated_days) VALUES
('Lahore', 180.00, 2500.00, 'Same Day / Next Day Delivery'),
('Karachi', 250.00, 3000.00, '2-3 Business Days'),
('Islamabad', 220.00, 3000.00, '1-2 Business Days'),
('Rawalpindi', 220.00, 3000.00, '1-2 Business Days'),
('Faisalabad', 200.00, 3000.00, '2 Business Days'),
('Multan', 220.00, 3000.00, '2 Business Days'),
('Peshawar', 250.00, 3500.00, '2-3 Business Days'),
('Sialkot', 200.00, 3000.00, '2 Business Days'),
('Gujranwala', 200.00, 3000.00, '1-2 Business Days'),
('Quetta', 300.00, 4000.00, '3-4 Business Days')
ON CONFLICT (city_name) DO NOTHING;

-- 4. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active, is_featured) VALUES
('11111111-1111-1111-1111-111111111101', 'Custom Mugs', 'custom-mugs', 'Personalized ceramic, magic color-changing, and stainless steel travel tumblers', '/products/category-mugs.jpg', 1, true, true),
('11111111-1111-1111-1111-111111111102', 'Luxury Pens', 'luxury-pens', 'Laser-engraved executive pens, metallic ballpoints, and boxed signature sets', '/products/category-pens.jpg', 2, true, true),
('11111111-1111-1111-1111-111111111103', 'Apparel & T-Shirts', 'apparel-t-shirts', 'Premium heavyweight cotton custom t-shirts and oversized graphic tees', '/products/category-shirts.jpg', 3, true, true),
('11111111-1111-1111-1111-111111111104', 'Hoodies & Sweatshirts', 'hoodies-sweatshirts', 'Cozy fleece pullover hoodies customized with embroidered or screen-printed designs', '/products/category-hoodies.jpg', 4, true, true),
('11111111-1111-1111-1111-111111111105', 'Custom Caps', 'custom-caps', 'Embroidered trucker caps, dad hats, and structured snapbacks', '/products/category-caps.jpg', 5, true, true),
('11111111-1111-1111-1111-111111111106', 'Phone Cases', 'phone-cases', 'Shockproof impact cases custom printed for iPhone and Samsung Galaxy', '/products/category-cases.jpg', 6, true, true),
('11111111-1111-1111-1111-111111111107', 'Love Cards', 'love-cards', 'Romantic anniversary, proposal, Valentine and couple greeting cards', '/products/category-love-cards.jpg', 7, true, true),
('11111111-1111-1111-1111-111111111108', 'Friendship Cards', 'friendship-cards', 'Fun, witty, and heartfelt cards celebrating best friendships and milestones', '/products/category-friendship-cards.jpg', 8, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 5. OCCASION COLLECTIONS
INSERT INTO public.collections (id, name, slug, description, image_url, is_active, is_occasion, occasion_type) VALUES
('22222222-2222-2222-2222-222222222201', 'Valentine''s & Love', 'valentines-love', 'Curated romantic gifts, personalized mugs, love letters & keepsake cards', '/collections/valentines.jpg', true, true, 'Valentine'),
('22222222-2222-2222-2222-222222222202', 'Friendship Day', 'friendship-day', 'Bestie gift combos, hilarious cards, matching tees & memory tumblers', '/collections/friendship.jpg', true, true, 'Friendship'),
('22222222-2222-2222-2222-222222222203', 'Eid Mubarak Specials', 'eid-specials', 'Festive personalized gift sets, gold-embossed Eidi envelopes & mugs', '/collections/eid.jpg', true, true, 'Eid'),
('22222222-2222-2222-2222-222222222204', 'Birthday Surprises', 'birthday-surprises', 'Memorable personalized gifts designed to make birthdays unforgettable', '/collections/birthday.jpg', true, true, 'Birthday'),
('22222222-2222-2222-2222-222222222205', 'Wedding & Anniversary', 'wedding-anniversary', 'Handmade luxury couple sets, laser engraved date gifts & keepsakes', '/collections/wedding.jpg', true, true, 'Anniversary')
ON CONFLICT (slug) DO NOTHING;

-- 6. SAMPLE PRODUCTS WITH REALISTIC ATTRIBUTES
-- Product 1: The Royal Gold Monogram Ceramic Mug
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333301',
    'The Royal Gold Monogram Ceramic Mug',
    'royal-gold-monogram-ceramic-mug',
    'MUG-GOLD-001',
    'High-grade gloss black ceramic mug with metallic gold monogram and personalized custom name.',
    'Crafted with 100% premium ceramic, this 11oz gloss mug features our signature MW Trends dual-fire glaze. Personalize with your recipient''s initial and full name in gleaming gold foil printing. Dishwasher safe and microwave safe.',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222204',
    450.00, 1299.00, 999.00, 48, true,
    true, true, true, true,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.350, true, 'mug',
    '[
        {"id": "name_text", "label": "Personalized Name", "type": "text", "placeholder": "e.g. Zaid Khan", "required": true, "char_limit": 20},
        {"id": "font_choice", "label": "Font Style", "type": "select", "options": ["Playfair Serif", "Signature Script", "Modern Sans", "Gothic Bold"], "default": "Playfair Serif"},
        {"id": "text_color", "label": "Gold Finish", "type": "select", "options": ["Champagne Gold", "Rose Gold", "Pure Gold", "Silver Chrome"], "default": "Pure Gold"}
    ]'::jsonb,
    'Custom Royal Gold Monogram Mug | MW Trends Pakistan',
    'Personalize your own Royal Gold Monogram Ceramic Mug in Pakistan. Fast delivery, custom name printing & cash on delivery available.',
    'custom mug pakistan', 4.95, 34, 185
) ON CONFLICT (slug) DO NOTHING;

-- Product 2: Executive Matte Black Laser-Engraved Pen
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333302',
    'Executive Matte Black Laser-Engraved Pen',
    'executive-matte-black-laser-engraved-pen',
    'PEN-EXEC-002',
    'Heavyweight brass rollerball pen in matte black finish with permanent laser-etched custom name in gold.',
    'Designed for professionals, corporate gifting, and graduates. Features a balanced 35g metal body, German 0.5mm ultra-smooth ink refill, and precision diamond-tip laser engraving that never fades.',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222204',
    350.00, 1150.00, 850.00, 85, true,
    true, true, true, false,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.120, true, 'pen',
    '[
        {"id": "name_text", "label": "Name for Engraving", "type": "text", "placeholder": "e.g. Dr. Haris Ali", "required": true, "char_limit": 24},
        {"id": "font_choice", "label": "Typography", "type": "select", "options": ["Signature Script", "Classic Serif", "Clean Modern"], "default": "Classic Serif"}
    ]'::jsonb,
    'Custom Laser Engraved Executive Pen in Pakistan | MW Trends',
    'Order personalized matte black engraved pens in Pakistan with velvet gift pouch. Perfect corporate or personal gift with COD.',
    'engraved pen pakistan', 4.90, 27, 210
) ON CONFLICT (slug) DO NOTHING;

-- Product 3: Signature Heavyweight Custom Unisex T-Shirt
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333303',
    'Signature 240 GSM Oversized Custom T-Shirt',
    'signature-240-gsm-oversized-custom-t-shirt',
    'SHIRT-OVER-003',
    'Ultra-soft 240 GSM 100% combed cotton streetwear tee with customized typography or monogram print.',
    'Drop shoulder streetwear cut made with bio-washed ring-spun Pakistani cotton. High definition screen print resists 50+ machine washes. Add custom initials, dates, or personal motivational quotes.',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222202',
    700.00, 2499.00, 1899.00, 60, true,
    true, true, true, true,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.280, true, 'tshirt',
    '[
        {"id": "name_text", "label": "Front Chest Text / Monogram", "type": "text", "placeholder": "e.g. LAHORE / 1998", "required": true, "char_limit": 18},
        {"id": "font_choice", "label": "Font Style", "type": "select", "options": ["Gothic Bold", "Minimal Serif", "Cyber Sans", "Script"], "default": "Gothic Bold"},
        {"id": "text_color", "label": "Print Color", "type": "select", "options": ["Gold Foil", "Off-White", "Pitch Black", "Blush Pink"], "default": "Gold Foil"}
    ]'::jsonb,
    'Custom Oversized 240 GSM T-Shirts Pakistan | MW Trends',
    'Buy custom printed premium heavy-cotton oversized tees in Pakistan. High quality print, modern fit, all sizes S to XXL.',
    'custom t-shirt pakistan', 4.88, 41, 140
) ON CONFLICT (slug) DO NOTHING;

-- Product 4: Couple "Soulmates" Anniversary Love Card
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333304',
    '"To My Soulmate" Gold-Foil Embossed Love Card',
    'to-my-soulmate-gold-foil-love-card',
    'CARD-LOVE-004',
    '350 GSM Italian textured cardstock with gold-stamped calligraphy and custom printed inner love message.',
    'A breathtaking romantic greeting card designed to be cherished forever. Enclosed in a handmade wax-sealed envelope. Include your heartfelt words printed inside or leave blank to handwrite.',
    '11111111-1111-1111-1111-111111111107',
    '22222222-2222-2222-2222-222222222201',
    90.00, 499.00, 399.00, 120, true,
    true, true, true, false,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.050, true, 'card',
    '[
        {"id": "name_text", "label": "Recipient Name", "type": "text", "placeholder": "e.g. My Beloved Ayesha", "required": true, "char_limit": 25},
        {"id": "message_text", "label": "Inner Message", "type": "textarea", "placeholder": "Write your romantic message here...", "required": true, "char_limit": 300},
        {"id": "date", "label": "Special Date", "type": "date", "placeholder": "Anniversary / Special Date", "required": false}
    ]'::jsonb,
    'Custom Gold Foil Love Card for Couples | MW Trends Pakistan',
    'Express your deepest love with custom gold-foil greeting cards in Pakistan. Custom message printing and wax seal envelope.',
    'custom love card pakistan', 4.97, 62, 380
) ON CONFLICT (slug) DO NOTHING;

-- Product 5: "Partner in Crime" Best Friend Custom Card
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333305',
    '"Partner In Crime" Witty Friendship Card',
    'partner-in-crime-witty-friendship-card',
    'CARD-FRND-005',
    'Fun, witty friendship greeting card with custom inside joke and personalized nicknames.',
    'Because a real best friend deserves more than a boring generic card! Printed on textured art card with lavender envelope and custom wax stamp.',
    '11111111-1111-1111-1111-111111111108',
    '22222222-2222-2222-2222-222222222202',
    80.00, 450.00, 350.00, 95, true,
    true, false, true, true,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.050, true, 'card',
    '[
        {"id": "name_text", "label": "Bestie Nickname", "type": "text", "placeholder": "e.g. Drama Queen / Bro", "required": true, "char_limit": 20},
        {"id": "message_text", "label": "Custom Inside Joke / Message", "type": "textarea", "placeholder": "Thanks for not telling anyone my secrets...", "required": true, "char_limit": 250}
    ]'::jsonb,
    'Friendship Day Greeting Card with Custom Message | MW Trends',
    'Unique and funny custom friendship cards in Pakistan. Personalized names and notes with express delivery across PK.',
    'friendship card pakistan', 4.92, 19, 130
) ON CONFLICT (slug) DO NOTHING;

-- Product 6: Custom Embroidered Minimalist Dad Cap
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333306',
    'Vintage Washed Cotton Embroidered Custom Cap',
    'vintage-washed-cotton-embroidered-custom-cap',
    'CAP-DAD-006',
    'Unstructured 6-panel washed cotton cap with custom high-density 3D embroidery of your initial or year.',
    'Crafted from 100% bio-washed twill cotton with antique brass buckle adjuster. Custom embroidered with our industrial Tajima machines.',
    '11111111-1111-1111-1111-111111111105',
    '22222222-2222-2222-2222-222222222204',
    400.00, 1499.00, 1199.00, 42, true,
    true, true, false, false,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.150, true, 'cap',
    '[
        {"id": "name_text", "label": "Custom Text / Initial", "type": "text", "placeholder": "e.g. M / 90s Kid / NYC", "required": true, "char_limit": 12},
        {"id": "font_choice", "label": "Embroidery Style", "type": "select", "options": ["College Gothic", "Clean Sans", "Cursive Script"], "default": "College Gothic"},
        {"id": "text_color", "label": "Thread Color", "type": "select", "options": ["Gold Thread", "Matte White", "Silver", "Crimson"], "default": "Gold Thread"}
    ]'::jsonb,
    'Custom Embroidered Baseball Caps Pakistan | MW Trends',
    'Order custom embroidered dad caps and vintage snapbacks in Pakistan. High quality stitching and comfortable fit.',
    'custom cap embroidery pakistan', 4.86, 21, 95
) ON CONFLICT (slug) DO NOTHING;

-- Product 7: Shockproof Matte Glass Custom Phone Case
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333307',
    'Impact Guard Custom Name Monogram Phone Case',
    'impact-guard-custom-name-monogram-phone-case',
    'CASE-IMP-007',
    'Military grade drop-tested case with anti-scratch tempered matte back and custom gold calligraphy.',
    'Available for iPhone 11 to 16 Pro Max, Samsung Galaxy S21 to S25 Ultra. Raised 1.5mm camera bezel and tactile metallic buttons.',
    '11111111-1111-1111-1111-111111111106',
    '22222222-2222-2222-2222-222222222204',
    420.00, 1650.00, 1250.00, 55, true,
    true, true, true, true,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.090, true, 'phone_case',
    '[
        {"id": "name_text", "label": "Your Name / Initials", "type": "text", "placeholder": "e.g. MALIK / M.W", "required": true, "char_limit": 15},
        {"id": "font_choice", "label": "Font Design", "type": "select", "options": ["Signature Luxury", "Bold Vertical", "Minimalist"], "default": "Signature Luxury"}
    ]'::jsonb,
    'Customized Phone Cases Pakistan (iPhone & Samsung) | MW Trends',
    'Personalized luxury phone covers in Pakistan. Custom name cases with shockproof bumper and gold monogram.',
    'custom phone case pakistan', 4.91, 38, 220
) ON CONFLICT (slug) DO NOTHING;

-- Product 8: Heavyweight Fleece Pullover Hoodie
INSERT INTO public.products (
    id, title, slug, sku, short_description, description, category_id, collection_id,
    base_cost_price, regular_price, sale_price, stock_quantity, track_stock,
    is_published, is_featured, is_trending, is_new,
    allowed_payment_methods, weight_kg, has_customization, mockup_type,
    custom_fields_schema, seo_title, seo_description, focus_keyword,
    rating_average, reviews_count, sales_count
) VALUES (
    '33333333-3333-3333-3333-333333333308',
    '360 GSM Luxury French Terry Fleece Hoodie',
    'luxury-french-terry-fleece-hoodie',
    'HD-FLC-008',
    'Heavyweight 360 GSM brushed fleece hoodie with double-layer hood and custom gold embroidered monogram.',
    'Designed for chilly Pakistan winters. Features kangaroo pocket, thick ribbed cuffs, nickel-tipped drawstrings, and custom personalized front chest monogram.',
    '11111111-1111-1111-1111-111111111104',
    '22222222-2222-2222-2222-222222222204',
    1200.00, 3999.00, 2999.00, 35, true,
    true, true, true, false,
    '["COD", "JazzCash", "Easypaisa", "BankTransfer", "Card"]'::jsonb, 0.650, true, 'hoodie',
    '[
        {"id": "name_text", "label": "Custom Chest Embroidery Text", "type": "text", "placeholder": "e.g. MW / EST. 2002", "required": true, "char_limit": 15},
        {"id": "font_choice", "label": "Style", "type": "select", "options": ["Roman Serif", "Athletic Bold", "Script"], "default": "Roman Serif"}
    ]'::jsonb,
    'Custom Fleece Hoodies Pakistan | MW Trends Premium Apparel',
    'Premium heavyweight 360 GSM fleece customized hoodies in Pakistan. Warm, cozy, tailored fit with fast courier dispatch.',
    'custom hoodie pakistan', 4.96, 53, 290
) ON CONFLICT (slug) DO NOTHING;

-- 7. PRODUCT VARIANTS (Sizes & Colors)
-- For T-Shirt (ID ...303)
INSERT INTO public.product_variants (product_id, title, size, color, color_hex, sku, price, cost_price, stock_quantity) VALUES
('33333333-3333-3333-3333-333333333303', 'Small / Jet Black', 'S', 'Jet Black', '#0A0A0A', 'SHIRT-S-BLK', 1899.00, 700.00, 15),
('33333333-3333-3333-3333-333333333303', 'Medium / Jet Black', 'M', 'Jet Black', '#0A0A0A', 'SHIRT-M-BLK', 1899.00, 700.00, 20),
('33333333-3333-3333-3333-333333333303', 'Large / Jet Black', 'L', 'Jet Black', '#0A0A0A', 'SHIRT-L-BLK', 1899.00, 700.00, 15),
('33333333-3333-3333-3333-333333333303', 'XL / Jet Black', 'XL', 'Jet Black', '#0A0A0A', 'SHIRT-XL-BLK', 1899.00, 700.00, 10),
('33333333-3333-3333-3333-333333333303', 'Medium / Ivory White', 'M', 'Ivory White', '#FAF8F3', 'SHIRT-M-IVR', 1899.00, 700.00, 12),
('33333333-3333-3333-3333-333333333303', 'Large / Ivory White', 'L', 'Ivory White', '#FAF8F3', 'SHIRT-L-IVR', 1899.00, 700.00, 14);

-- For Hoodie (ID ...308)
INSERT INTO public.product_variants (product_id, title, size, color, color_hex, sku, price, cost_price, stock_quantity) VALUES
('33333333-3333-3333-3333-333333333308', 'Medium / Deep Black', 'M', 'Deep Black', '#0A0A0A', 'HD-M-BLK', 2999.00, 1200.00, 15),
('33333333-3333-3333-3333-333333333308', 'Large / Deep Black', 'L', 'Deep Black', '#0A0A0A', 'HD-L-BLK', 2999.00, 1200.00, 15),
('33333333-3333-3333-3333-333333333308', 'XL / Deep Black', 'XL', 'Deep Black', '#0A0A0A', 'HD-XL-BLK', 2999.00, 1200.00, 8);

-- 8. CURATED GIFT BUNDLES
INSERT INTO public.bundles (title, slug, description, image_url, bundle_price, compare_at_price, item_product_ids, is_active) VALUES
(
    'The Executive Gentleman Combo',
    'the-executive-gentleman-combo',
    'Includes the Royal Gold Monogram Mug and the Laser-Engraved Matte Black Pen in a premium gold-ribbon magnetic gift box.',
    '/bundles/executive-combo.jpg',
    1699.00,
    2449.00,
    '["33333333-3333-3333-3333-333333333301", "33333333-3333-3333-3333-333333333302"]'::jsonb,
    true
),
(
    'The "Forever & Always" Anniversary Duo',
    'the-forever-and-always-anniversary-duo',
    'Custom Gold Monogram Mug paired with the Italian Gold-Foil "To My Soulmate" Card in luxury gift wrapping.',
    '/bundles/anniversary-duo.jpg',
    1299.00,
    1798.00,
    '["33333333-3333-3333-3333-333333333301", "33333333-3333-3333-3333-333333333304"]'::jsonb,
    true
),
(
    'Besties Streetwear & Card Pack',
    'besties-streetwear-and-card-pack',
    'Oversized 240 GSM Custom T-Shirt and the "Partner In Crime" Card. The ultimate bestie gift.',
    '/bundles/besties-pack.jpg',
    2150.00,
    2949.00,
    '["33333333-3333-3333-3333-333333333303", "33333333-3333-3333-3333-333333333305"]'::jsonb,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 9. FLASH SALES
INSERT INTO public.flash_sales (
    id, title, slug, description, banner_url, start_datetime, end_datetime, is_active
) VALUES (
    '44444444-4444-4444-4444-444444444401',
    'Mid-Season Mega Drop — 24 Hour Flash Sale',
    'mid-season-mega-drop',
    'Extra up to 40% OFF trending personalized gifts for a limited 24-hour window.',
    '/banners/flash-sale-banner.jpg',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '22 hours',
    true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.flash_sale_items (flash_sale_id, product_id, flash_price, stock_limit, sold_count) VALUES
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 899.00, 30, 18),
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', 749.00, 50, 24)
ON CONFLICT (flash_sale_id, product_id) DO NOTHING;

-- 10. MARKETING COUPONS
INSERT INTO public.coupons (
    code, description, discount_type, discount_value, min_order_value, max_discount_amount,
    usage_limit, per_user_limit, used_count, start_date, end_date, is_active
) VALUES
('MW10', 'Flat 10% OFF on all orders above Rs. 1,500', 'percentage', 10.00, 1500.00, 500.00, 500, 1, 42, NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days', true),
('FREESHIP', 'Free Express Shipping Nationwide on orders above Rs. 2,000', 'free_shipping', 250.00, 2000.00, 250.00, 300, 1, 76, NOW() - INTERVAL '10 days', NOW() + INTERVAL '45 days', true),
('GOLD300', 'Flat Rs. 300 Instant Discount on luxury gift bundles', 'fixed', 300.00, 2500.00, 300.00, 200, 1, 19, NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days', true),
('WELCOME15', '15% OFF for new customers on first order', 'percentage', 15.00, 1000.00, 750.00, 1000, 1, 88, NOW() - INTERVAL '30 days', NOW() + INTERVAL '90 days', true)
ON CONFLICT (code) DO NOTHING;

-- 11. HOMEPAGE & PROMO BANNERS
INSERT INTO public.banners (title, subtitle, image_url, link_url, position, sort_order, is_active) VALUES
('Customized With Pure Precision', 'Elevate your gift giving with Pakistan''s finest laser-engraved & gold-foil print studio.', '/banners/hero-1.jpg', '/shop', 'homepage_hero', 1, true),
('Express Nationwide Delivery', 'Orders dispatched within 24-48 hours. Cash on Delivery available across 250+ cities.', '/banners/hero-2.jpg', '/shop', 'announcement_top', 2, true)
ON CONFLICT DO NOTHING;

-- 12. VERIFIED REVIEWS
INSERT INTO public.reviews (
    product_id, author_name, author_email, rating, title, comment, is_verified_buyer, is_approved, is_featured, helpful_count
) VALUES
('33333333-3333-3333-3333-333333333301', 'Hamza Tariq', 'hamza.t@gmail.com', 5, 'Exceptional gold finish!', 'I ordered this customized mug for my brother''s graduation. The gold lettering shines beautifully and feels truly high-end. Received in Lahore in 24 hours. 10/10.', true, true, true, 14),
('33333333-3333-3333-3333-333333333301', 'Aiman Malik', 'aiman.m@outlook.com', 5, 'Loved the packaging & mug', 'The gift box was so aesthetic with gold ribbon. Mug is microwave safe and the custom text was 100% accurate. Ordering another for my best friend.', true, true, true, 9),
('33333333-3333-3333-3333-333333333302', 'Bilal Farooq', 'bilal.f@yahoo.com', 5, 'Professional corporate feel', 'The laser engraving on the matte pen is razor sharp. Ink flows super smoothly. Highly recommended for office or doctor gifts.', true, true, false, 6),
('33333333-3333-3333-3333-333333333304', 'Sana Zehra', 'sana.z@gmail.com', 5, 'Made my anniversary so special', 'The paper quality of the card is heavy Italian cardstock and the wax seal on the envelope made my husband so emotional. Thank you MW Trends team!', true, true, true, 18);
