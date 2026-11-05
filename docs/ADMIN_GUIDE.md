# MW Trends — Admin Operations & Store Owner Handbook

Welcome to the **MW Trends** administrative control panel. This handbook provides step-by-step instructions for managing catalog products, fulfilling customer orders, verifying manual payments, launching marketing campaigns, and monitoring studio profits.

---

## 1. Accessing the Admin Desk

- Direct URL: `https://your-domain.com/admin` (or `http://localhost:3000/admin` locally).
- The admin layout supports both **Dark Mode** and **Light Mode** via the theme toggle in the header.
- The sidebar provides quick navigation across all core operational modules.

---

## 2. Managing Products & Personalized Offerings (`/admin/products`)

### Adding a New Product:
1. Navigate to **Products & Catalog** → Click **+ Add New Product**.
2. **General Details**: Enter title, SKU, category, short summary, and detailed product description. The URL slug is automatically generated from your title.
3. **Studio Cost & Selling Price (PKR)**:
   - **Base Cost Price**: Enter the raw manufacturing/materials cost (e.g. Rs. 450 for a ceramic mug + foil). This is used by the system to compute your true net profit.
   - **Regular Price & Sale Price**: Set customer-facing prices. If a sale price is set, the storefront automatically displays a strikethrough price and a percentage discount badge.
4. **Customization & 3D Live Mockup**:
   - Toggle **Customization & 3D Mockup Engine** ON.
   - Choose the mockup template type: *Ceramic Mug*, *Rollerball Pen*, *T-Shirt*, *Hoodie*, *Dad Cap*, *Phone Case*, or *Greeting Card*.
   - The storefront will render an interactive canvas showing the customer's text in real time with metallic reflections and authentic fonts.
5. **Allowed Payment Methods**:
   - Select which payment methods you accept for this specific product (e.g., Cash on Delivery, JazzCash, Easypaisa, Bank Transfer, Card). If you want high-value or fragile items to be prepaid only, simply uncheck COD.
6. **SEO Focus Keyword & Checklist**:
   - Enter your focus keyword (e.g., `custom mug pakistan`). The built-in SEO scoring tool will evaluate title length, keyword placement, and meta description suitability.

### Bulk Actions & CSV Export:
- Click **Export CSV** to download a spreadsheet of your entire product catalog for offline inventory tracking.

---

## 3. Order Processing & Fulfillment Workflow (`/admin/orders`)

Each order follows a standardized 5-step fulfillment lifecycle:
`New` ➔ `Confirmed` ➔ `In Production` ➔ `Shipped` ➔ `Delivered`

### Processing an Incoming Order:
1. Click **Inspect** on any order row in `/admin/orders`.
2. Review the customer's shipping address and mobile phone number.
3. **Print-Ready Specifications**: The system highlights the exact custom text, font family, and foil color entered by the customer in a dedicated box.
4. Click **Print Invoice / Slip** to generate an A4 packing slip and courier shipping label.

### Verifying Manual Payment Proofs (JazzCash, Easypaisa, Bank Transfer):
1. In the order details sidebar, find the **Payment Verification** card.
2. Click **Inspect Receipt Screenshot**.
3. A modal will display the customer's entered Transaction ID (TID) and uploaded transfer receipt image.
4. Verify the funds in your JazzCash/Easypaisa merchant app or bank statement.
5. Click **Approve & Verify Payment** to mark the payment verified and automatically transition order status to `Confirmed`.

### Booking & Dispatching Couriers:
1. In the **Courier Booking** card, select the partner courier (*TCS Express*, *Leopards*, *Call Courier*, *Trax Logistics*, etc.).
2. Enter the Tracking Number / Consignment Number (CN #).
3. Click **Mark Dispatched & Send Tracking**. The customer can now track their package in real time on `/track-order`.

### Communicating via WhatsApp:
- Click **WhatsApp Customer** at the top of the order page. This automatically opens a pre-filled WhatsApp conversation with the customer informing them of their order status and tracking details.

---

## 4. Profitability & Expense Tracking

For every order, the system automatically computes:
$$\text{Net Profit} = \text{Revenue} - (\text{Item Cost of Goods} + \text{Courier Shipping Fee} + \text{Packaging \& Ad Overhead})$$
$$\text{Profit Margin} = \left(\frac{\text{Net Profit}}{\text{Net Revenue}}\right) \times 100$$
You can adjust the courier fee and packing expense per order to see your exact net margin.

---

## 5. Marketing & Urgency Engine

- **Coupons (`/admin/marketing/coupons`)**:
  Create promo codes with percentage discounts (e.g., `MW10` for 10% off), fixed cash discounts (e.g., `GOLD300` for Rs. 300 off), or free shipping (`FREESHIP`). Set minimum order limits to protect margins.
- **Flash Sales (`/admin/marketing/flash-sales`)**:
  Enable limited-time flash sales with a live countdown timer displayed across the top of the storefront.
- **Combos & Bundles (`/admin/marketing/bundles`)**:
  Bundle complementary products (e.g., Royal Gold Mug + Laser Pen in an Executive Gift Box) at a discounted price to boost Average Order Value (AOV).

---

## 6. Staff Roles & Permissions (RBAC) (`/admin/team`)

MW Trends features a granular permission hierarchy:
- **Owner**: Full unrestricted control over all financial data, staff permissions, and settings.
- **Admin**: Full access to products, orders, customers, and marketing. Cannot alter merchant bank credentials.
- **Manager**: Operational control over day-to-day fulfillment and catalog updates.
- **Order Handler**: Restricted access to the orders desk for packing and courier tracking entry. Financials and settings are hidden.
- **Content / SEO Editor**: Access to product descriptions, blog pages, and SEO metadata.

---

## 7. Security & Activity Audit Log (`/admin/audit-logs`)

Every administrative action—including order status changes, price edits, payment approvals, and staff invitations—is automatically logged with the staff email, timestamp, and IP address for complete transparency and security.
