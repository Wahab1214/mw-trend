# MW Trends — Complete Production E-Commerce Brief

You are a principal full-stack engineer, senior UI/UX designer and SEO specialist. Build the COMPLETE, production-ready e-commerce website for "MW Trends" described below, end to end, in this single task. Do not ask me questions; where something is unspecified, choose the best professional option and list it under "Assumptions" at the end.

# 0. HOW TO WORK (mandatory)
1. First create /PROJECT_CONTEXT.md (full copy of this brief) and /TODO.md (checklist of every feature below). Update TODO.md as you go.
2. Work in internal milestones in this order: Setup+Design System → Database+Auth+Roles → Storefront → Customization+Cart+Wishlist → Checkout+Payments → Customer Account+Tracking → Admin (dashboard, products, orders, customers, team) → Sales Engine → SEO → Polish+Deploy.
3. After EACH milestone: run lint, typecheck, build, and test the feature in the browser; fix everything before moving on. Never leave stubs, fake buttons, TODO comments or dummy data on final pages (seed realistic sample products only in a separate seed script).
4. Do not stop until every item in TODO.md is done and every quality gate in section 14 passes.
5. Never use hardcoded secrets. Everything configurable goes in .env (provide .env.example).

# 1. BRAND
Brand: MW Trends. Premium print-on-demand store in Pakistan (currency PKR, "Rs.").
Products: mugs, pens, t-shirts, hoodies, caps, phone cases, love cards, friendship cards, and any trending/interesting gift items. Owner must be able to add ANY new category/product type later from admin without code changes.
Identity: black + restrained gold, MW geometric monogram (gold on black, central diamond), "TRENDS" in script below. Logo file will be placed at /public/brand/logo.png (use a clean SVG monogram placeholder until then).
Audience: mostly mobile users in Pakistan on slow networks → mobile-first, fast, lightweight.
Feel: premium, modern, gift-worthy, trustworthy, engaging.

# 2. TECH STACK (fixed)
Next.js (latest stable, App Router), TypeScript strict, Tailwind CSS, Framer Motion (light use), Supabase (Postgres, Auth, Storage, Row Level Security), next-themes, lucide-react, Zod + React Hook Form, TanStack Table or equivalent for admin tables, Recharts for dashboard charts. Deploy target: Vercel free tier (must work on free limits), later custom domain. Clean folder structure, reusable components, no unused dependencies.

# 3. DESIGN SYSTEM (dark AND light theme, both mandatory)
Theme via CSS variables + next-themes, default system, user toggle persisted, no flash on load.
DARK: bg #0A0A0A, surface #121212, elevated #1A1A1A, border #2A2A2A, text #F5F1E8 / #A8A29A / #6F6A63, gold #C9A44C (light #E3C877, dark #9A7B2F).
LIGHT: bg #FAF8F3, surface #FFFFFF, elevated #F3EFE6, border #E4DED1, text #14120F / #5C564D / #8C857A, gold #A8832A (light #C9A44C, dark #7A5F1B).
Status colors: success #2E9D6B, warning #D98E04, danger #D64545, info #3B82C4. Soft accents for love/friendship collections: blush pink #F4C6D0, lavender #D9CFF0.
Gold is used sparingly (accents, CTAs, highlights). WCAG AA contrast in both themes. Display serif (Playfair Display or Cormorant Garamond) for headings, Inter for body, script font only for brand accents. Respect prefers-reduced-motion. Build a full reusable UI kit (Button, Input, Select, Checkbox, Switch, Modal, Drawer, Tabs, Accordion, Toast, Skeleton, Badge, Price, Rating, Quantity stepper, Table, Pagination, EmptyState, Breadcrumb, ThemeToggle, etc.) and a hidden /style-guide page.
Layout: announcement bar, sticky header (logo, nav, search, wishlist, cart with count, theme toggle, account), footer (links, payment icons, social, WhatsApp), floating WhatsApp button, mobile bottom navigation bar.

# 4. STOREFRONT (public)
- Home: hero, Trending Now, New Drops, Occasion collections (Valentine's, Friendship Day, Eid, Birthday, Wedding, Anniversary), Gift Finder teaser, active sale/flash-sale banner with countdown, bundles, best sellers, customer reviews, Instagram/WhatsApp CTA, trust badges (secure, fast delivery, easy returns).
- Shop: grid/list, filters (category, price range, occasion, in stock, on sale, rating), sorting, pagination or infinite scroll, URL-synced filters.
- Category and Collection pages (admin-managed).
- Product page: image gallery with zoom, variants (size, color), price + sale price + discount %, stock status ("Only 3 left"), customization form (see 5), per-product accepted payment methods shown, delivery info, reviews with photos, related products, share, wishlist, sticky Add-to-Cart on mobile, WhatsApp "Order via WhatsApp" button.
- Search: instant search with suggestions and typo-tolerance (Postgres full-text/trigram), search results page.
- Gift Finder: wizard (who is it for → occasion → budget) → suggested products.
- Recently viewed, wishlist (works for guests via local storage, syncs on login).
- Static pages (admin-editable where practical): About, Contact (form saved to DB), FAQ, Shipping & Returns, Privacy, Terms.
- Custom 404 and error pages.

# 5. CUSTOMIZATION (Phase 1 now, Phase 2 ready)
Phase 1 (build now): per-product customization fields configured in admin (e.g., name text, message text, font choice, text color, date, plus optional selection). Live preview on the product mockup (text rendered on mug/card/shirt template image) updating in real time. Character limits and validation. Customization data saved with cart line and order item and visible to admin for printing.
Phase 2 (prepare DB + storage only, feature flag OFF): design/image upload fields (Supabase Storage bucket, file type/size validation, per-order-item upload reference). Add a "customer upload" toggle per product in admin, hidden/disabled until the flag is enabled.

# 6. CART & CHECKOUT
- Cart drawer + cart page, quantity edit, remove, coupon field, shipping estimate, order summary, persisted for guests and users.
- Checkout: guest checkout AND login checkout. Fields: name, phone (Pakistan format validation), email (optional), city (dropdown + free text), full address, notes. Order review, terms checkbox.
- Per-product payment control: each product has its own allowed methods (COD, JazzCash, Easypaisa, Card, Bank Transfer). At checkout only methods allowed for ALL cart items are offered; if conflict, explain clearly and suggest splitting.
- Payments (build in a pluggable adapter pattern): COD works fully. JazzCash/Easypaisa/Bank Transfer work in "manual verification mode" (show merchant account details from admin settings, customer uploads payment screenshot + transaction ID, admin approves/rejects). Card and official JazzCash/Easypaisa gateway integrations are scaffolded behind adapters with env-based keys, ready to switch on once merchant accounts are approved. Never store card data.
- Shipping rules configurable in admin: flat rate, free shipping above threshold, per-city or per-weight overrides.
- Order creation must be atomic and idempotent (no duplicate orders on double-click), stock decremented safely, unique readable order number (e.g., MW-000123).
- Order confirmation page + email (Resend or Supabase SMTP, configurable) + admin notification (email and optional WhatsApp link).

# 7. CUSTOMER ACCOUNT
Sign up/login (email+password, Google login), forgot/reset password, profile, saved addresses, order history, order detail, public order-tracking page (order number + phone) with status timeline (New → Confirmed → In Production → Shipped → Delivered / Cancelled / Returned) and courier name + tracking number + tracking link, reorder, wishlist, leave review (verified buyers only).

# 8. ADMIN PANEL (/admin, protected, separate layout, dark/light supported)
Dashboard: today/week/month/custom range; total orders, new orders, pending orders, pending payments, delivered, cancelled/returned, total sales, total cost, net profit, profit margin, average order value; charts (sales over time, orders by status, orders by source, top products, top categories); low-stock alerts; recent orders; pending-payment-verification queue.
Products: create/edit/delete/duplicate/archive, drag-and-drop multi-image upload (resize/compress), categories & subcategories (full CRUD), tags, collections, occasions, variants (size/color) with own price/stock/SKU, base cost price (for profit), selling price, sale price, stock tracking, status (draft/published/scheduled), featured/trending/new flags, customization-field builder, allowed payment methods per product, shipping weight, SEO fields (see 10), bulk actions (publish, hide, delete, change category, bulk price update), CSV import/export.
Orders: table with search/filter (status, payment status, payment method, source, city, date range, courier), bulk status update, order detail page: customer info, items with customization data + preview (printable), status changer with history/audit log, payment status + verify payment screenshot, internal notes, courier + tracking number, item cost/courier cost/other expense (ads/packing) → auto profit and margin per order, print invoice/packing slip/label (PDF), export CSV/Excel, WhatsApp-message shortcut to customer, create manual order (for WhatsApp/Instagram/Facebook orders) with order source field (WhatsApp, Facebook, Instagram, TikTok, Website, Referral, Other).
Customers: list, search, order history, total spent, notes, block/unblock.
Reviews moderation; Contact messages inbox.
Marketing / Sales Engine: sale pricing on product/category/collection, % or fixed discounts, coupon codes (usage limits, per-user limits, min order, start/end dates, specific products/categories, free-shipping coupons), flash sales with scheduled start/end and countdown, bundles/combos ("Mug + Card combo"), buy-X-get-Y, announcement bar and homepage banners (image, text, link, schedule), occasion collections.
Settings: store info, logo, contact, WhatsApp number, social links, shipping rules, payment account details (JazzCash/Easypaisa/bank), tax toggle, email templates, theme colors accents (limited), maintenance mode, SEO defaults.
Team & roles: invite staff by email; roles Owner (everything), Admin, Manager, Order Handler, Content/SEO Editor, Viewer; granular permission matrix (products, orders, customers, marketing, settings, team, reports); owner can create custom roles; enable/disable accounts; activity/audit log (who changed what, when). Enforce permissions BOTH in UI and in database (RLS) and server actions.

# 9. DATABASE & SECURITY
Design a normalized Supabase schema with migrations (SQL files): profiles, roles, permissions, products, product_images, variants, categories, collections, tags, customization_fields, orders, order_items (with customization JSON + future upload reference), order_status_history, payments, payment_proofs, coupons, coupon_usages, sales/campaigns, bundles, banners, reviews, wishlists, addresses, shipping_rules, settings, contact_messages, audit_logs, pages. Add indexes, constraints, triggers (updated_at, stock), seed script (admin owner + sample products across all categories + sample coupons).
Security: Row Level Security on every table, server-side validation with Zod on every mutation, rate limiting on auth/checkout/contact, CSRF-safe server actions, input sanitization, secure file upload rules, no service-role key on client, security headers, audit logging, protected admin routes via middleware.

# 10. SEO (critical)
Per-product and per-category editable: SEO title, meta description, URL slug (auto-generated, editable, unique, redirect on change), canonical URL, OG image, noindex toggle, alt text for every image, focus keyword with a simple SEO score/checklist in admin.
Technical: server-rendered pages, generateMetadata everywhere, dynamic sitemap.xml (products, categories, collections, pages), robots.txt, JSON-LD schema (Organization, WebSite+SearchAction, Product with offer/price/availability/aggregateRating, BreadcrumbList, FAQ), clean URLs (/product/slug, /category/slug), breadcrumbs, next/image with WebP/AVIF, lazy loading, fonts via next/font, hreflang-ready, canonical handling for filtered pages, OG/Twitter cards, 301 redirects manager in admin, Google Analytics 4 + Search Console verification + Meta Pixel via env IDs (consent-aware), Core Web Vitals optimized.

# 11. EXTRA ENGAGEMENT FEATURES
Flash-sale countdowns, "low stock" and "X people viewing/bought" only if based on real data (no fake urgency), wishlist, reviews with photos, gift wrap + gift message option, referral-ready coupon system, abandoned-cart reminder data captured (email/phone) for later use, WhatsApp share buttons, back-in-stock notify me, PWA-ready (installable), optional Urdu/English language toggle structure (English default, i18n-ready).

# 12. PERFORMANCE, ACCESSIBILITY, QUALITY
Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility/best-practices/SEO on home, shop, product pages. Responsive from 320px to 1920px, no horizontal scroll. Keyboard accessible, proper aria, focus rings. Loading skeletons, error boundaries, empty states, optimistic UI where safe, toasts for every action. Zero TypeScript errors, zero ESLint errors, `npm run build` passes, no console errors.

# 13. DEPLOYMENT
Vercel-ready: vercel.json if needed, env var list, Supabase project setup steps, running migrations and seed, creating the first Owner account, connecting custom domain later, and a README with exact step-by-step instructions (beginner friendly). Include a /docs/ADMIN_GUIDE.md explaining how the owner uses every admin feature, and /docs/PHASE2_UPLOAD.md explaining how to enable design-upload later.

# 14. FINAL QUALITY GATES (all must pass before you finish)
- Full test pass of these flows in browser, both themes, mobile + desktop: browse → search → product → customize with live preview → add to cart → coupon → checkout (COD and manual-payment) → order created → admin sees it → admin changes status → customer tracks it.
- Admin: create/edit/delete product with images, per-product payment methods, sale + coupon + flash sale working on storefront, role created with limited permissions and verified that restricted pages/data are blocked (UI and DB).
- SEO: sitemap, robots, schema validated, metadata on every page.
- Lint, typecheck, build, Lighthouse results reported with real numbers.
