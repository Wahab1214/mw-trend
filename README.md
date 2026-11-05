# MW Trends — Premium Print-on-Demand & Personalized Gift Studio

A production-ready, full-stack Next.js e-commerce platform built for **MW Trends**, Pakistan's premier personalized gifts and print-on-demand studio.

## 🌟 Key Features

- **Brand & Luxury Aesthetics**: Custom black + restrained gold identity, geometric monogram, mobile-first, and WCAG AA contrast in both Dark and Light modes.
- **Dynamic 3D Live Mockup Preview**: Real-time rendering of customized names, font typography, and gold foil finishes on Mugs, Laser-Engraved Pens, T-Shirts, Hoodies, Caps, Phone Cases, and Greeting Cards.
- **Pakistan-First E-Commerce**:
  - Currency in PKR (`Rs.`) with thousands formatting.
  - Nationwide delivery coverage across 250+ cities via TCS, Leopards, Call Courier, and Trax.
  - Full **Cash on Delivery (COD)** support with mobile verification.
  - Manual payment verification for **JazzCash**, **Easypaisa**, and **Direct Bank Transfer (Raast / Meezan Bank)** with receipt screenshot upload and transaction ID (TID) auditing.
  - Per-product payment compatibility resolution.
- **Gift Finder Wizard**: 3-step interactive gift curator based on recipient, occasion, and budget in PKR.
- **Live Order Tracking**: Public tracking portal (`/track-order`) with visual progress timeline (`New` → `Confirmed` → `In Production` → `Shipped` → `Delivered`) and courier tracking hyperlinks.
- **Comprehensive Administration Suite (`/admin`)**:
  - Analytics Dashboard with Recharts (Gross sales, net profit, profit margin %, AOV, revenue by acquisition channel, low stock warnings).
  - Product Catalog CRUD with multi-image gallery, variant matrix, customization builder, per-product payment method restrictions, and CSV export.
  - Order Fulfillment Center: Status updater, payment receipt inspector with Approve/Reject actions, automatic profit/margin calculator, printable invoices/slips, and 1-click WhatsApp customer messaging.
  - Marketing Engine: Coupons & discounts (percentage, fixed, free shipping), flash sales scheduler with live countdown, and curated gift combos.
  - Team & RBAC: Granular permission matrix across roles (Owner, Admin, Manager, Order Handler, Content/SEO Editor, Viewer).
  - Immutable Audit & Activity Logs.
- **SEO & Performance Architecture**: Server-rendered metadata, dynamic `sitemap.xml`, `robots.txt`, JSON-LD schemas (Organization, WebSite with SearchAction, Product with offer/reviews, FAQPage).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router (React 18, TypeScript Strict)
- **Styling**: Tailwind CSS with custom CSS variables & next-themes
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database & Auth**: Supabase (Postgres 15+, Row Level Security, Migration SQLs)
- **Validation**: Zod & React Hook Form
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Quick Setup & Local Development

### 1. Prerequisites
- Node.js LTS (v20+ or v26+)
- npm or pnpm

### 2. Clone and Install Dependencies
```bash
cd "MW Trends"
npm install
```

### 3. Environment Variables Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```
*(Note: MW Trends includes an internal mock data fallback layer, ensuring the application runs and renders complete realistic catalog data immediately even before Supabase is connected).*

### 4. Database Setup & Migrations
Execute the SQL migrations in your Supabase SQL Editor:
1. Run `/supabase/migrations/20261105000000_init_schema.sql` (Creates all tables, RLS policies, order sequences, and triggers).
2. Run `/supabase/seed.sql` (Populates Pakistani products across mugs, pens, shirts, hoodies, caps, cards, plus default store settings and shipping rates).

### 5. Run the Local Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🧪 Build & Quality Verification

```bash
# Typecheck
npm run typecheck

# Lint check
npm run lint

# Production build
npm run build
```

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Import the project into your Vercel Dashboard.
3. Add the environment variables specified in `.env.example`.
4. Deploy! Vercel will automatically build and distribute the app across global edge networks with zero configuration needed.

---

## 📖 Documentation

- [Admin User Guide](/docs/ADMIN_GUIDE.md): Complete owner handbook explaining how to manage products, verify payments, dispatch couriers, and read profit analytics.
- [Phase 2 Customer Upload Guide](/docs/PHASE2_UPLOAD.md): Instructions on enabling customer file/design uploads with Supabase Storage.
- [UI Style Guide](http://localhost:3000/style-guide): Hidden component showcase page.
