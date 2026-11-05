// ==============================================================================
// MW TRENDS — CORE TYPE DEFINITIONS
// ==============================================================================

export type PaymentMethod = 'COD' | 'JazzCash' | 'Easypaisa' | 'BankTransfer' | 'Card';

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'In Production'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'pending' | 'paid' | 'verified' | 'failed' | 'refunded';

export type RoleType = 'owner' | 'admin' | 'manager' | 'order_handler' | 'editor' | 'viewer' | 'customer';

export type MockupType = 'mug' | 'pen' | 'tshirt' | 'hoodie' | 'cap' | 'phone_case' | 'card';

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  options?: string[];
  default?: string;
  required?: boolean;
  char_limit?: number;
  price_delta?: number;
}

export interface CustomizationValues {
  name_text?: string;
  message_text?: string;
  font_choice?: string;
  text_color?: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  size?: string;
  color?: string;
  color_hex?: string;
  sku?: string;
  price?: number;
  cost_price?: number;
  stock_quantity: number;
  image_url?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description: string;
  category_id?: string;
  category_name?: string;
  collection_id?: string;
  base_cost_price: number;
  regular_price: number;
  sale_price?: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  track_stock: boolean;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_new: boolean;
  allowed_payment_methods: PaymentMethod[];
  weight_kg: number;
  has_customization: boolean;
  mockup_type?: MockupType;
  custom_fields_schema?: CustomFieldDefinition[];
  allow_customer_upload?: boolean;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  rating_average: number;
  reviews_count: number;
  sales_count: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  product_count?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  is_occasion: boolean;
  occasion_type?: string;
  product_count?: number;
}

export interface CartItem {
  id: string; // unique item id (composite of product + variant + hash of customization)
  product_id: string;
  variant_id?: string;
  title: string;
  variant_title?: string;
  sku?: string;
  image_url: string;
  unit_price: number;
  unit_cost: number;
  quantity: number;
  allowed_payment_methods: PaymentMethod[];
  customization_data?: CustomizationValues;
  mockup_type?: MockupType;
  customer_upload_url?: string;
  customer_upload_notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_title: string;
  variant_title?: string;
  sku?: string;
  product_image?: string;
  unit_price: number;
  unit_cost: number;
  quantity: number;
  line_total: number;
  customization_data?: CustomizationValues;
  customer_upload_url?: string;
  customer_upload_notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province?: string;
  shipping_postal_code?: string;
  order_notes?: string;
  order_source: string;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_fee: number;
  gift_wrap_fee: number;
  gift_message?: string;
  total_amount: number;
  currency: string;
  total_cost_price: number;
  courier_cost: number;
  packaging_ad_expense: number;
  net_profit: number;
  profit_margin_percent: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  courier_name?: string;
  tracking_number?: string;
  tracking_url?: string;
  dispatched_at?: string;
  delivered_at?: string;
  internal_notes?: string;
  items?: OrderItem[];
  payment_proof?: PaymentProof;
  created_at: string;
  updated_at?: string;
}

export interface PaymentProof {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  transaction_id: string;
  sender_account_name?: string;
  sender_phone_or_account?: string;
  proof_image_url?: string;
  amount_paid: number;
  status: 'pending_review' | 'approved' | 'rejected';
  admin_notes?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping';
  discount_value: number;
  min_order_value: number;
  max_discount_amount?: number;
  usage_limit?: number;
  per_user_limit: number;
  used_count: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
}

export interface FlashSale {
  id: string;
  title: string;
  slug: string;
  description?: string;
  banner_url?: string;
  start_datetime: string;
  end_datetime: string;
  is_active: boolean;
  items?: {
    product_id: string;
    product?: Product;
    flash_price: number;
    stock_limit?: number;
    sold_count: number;
  }[];
}

export interface Bundle {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  bundle_price: number;
  compare_at_price: number;
  item_product_ids: string[];
  products?: Product[];
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  author_email?: string;
  rating: number;
  title?: string;
  comment: string;
  photo_urls?: string[];
  is_verified_buyer: boolean;
  is_approved: boolean;
  is_featured: boolean;
  helpful_count: number;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  province?: string;
  is_default: boolean;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  contact_phone: string;
  whatsapp_number: string;
  contact_email: string;
  store_address: string;
  currency_code: string;
  currency_symbol: string;
  flat_shipping_rate: number;
  free_shipping_threshold: number;
  gift_wrap_price: number;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  payment_accounts: {
    jazzcash?: {
      title: string;
      number: string;
      till_id?: string;
      instructions: string;
    };
    easypaisa?: {
      title: string;
      number: string;
      instructions: string;
    };
    bank?: {
      bank_name: string;
      account_title: string;
      account_number: string;
      iban: string;
      branch: string;
      instructions: string;
    };
  };
  maintenance_mode: boolean;
  default_seo_title?: string;
  default_seo_description?: string;
}

export interface StaffUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: RoleType;
  is_blocked: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
