export type Role = 'customer' | 'admin' | 'staff';

export type ProductType = 'simple' | 'variable';

export type PaymentMethodType = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'bank';

export type PaymentStatusType = 'pending' | 'verified' | 'failed' | 'refunded';

export type FulfillmentStatusType =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type MovementType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'cancel';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  role: Role;
  avatar_url: string | null;
  default_address?: {
    district?: string;
    city?: string;
    address?: string;
    notes?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  description_en: string | null;
  description_bn: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: string;
  code: string;
  name_en: string;
  name_bn: string;
  created_at: string;
}

export interface AttributeOption {
  id: string;
  attribute_id: string;
  value: string;
  label_en: string;
  label_bn: string;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  is_in_stock: boolean;
  attribute_values?: {
    attribute_id: string;
    attribute_code: string;
    option_id: string;
    value: string;
    label_en: string;
    label_bn: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  category?: Category;
  name_en: string;
  name_bn: string;
  slug: string;
  sku: string;
  product_type: ProductType;
  description_en: string | null;
  description_bn: string | null;
  details_en: string | null;
  details_bn: string | null;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_in_stock: boolean;
  is_active: boolean;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  variant_id: string | null;
  change_quantity: number;
  previous_stock: number;
  new_stock: number;
  movement_type: MovementType;
  reason: string;
  created_by: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  sku: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_reference: string;
  user_id: string | null;
  guest_info?: {
    email?: string;
    city_upazila?: string;
  };
  customer_name: string;
  contact_phone: string;
  delivery_district: string;
  delivery_address: string;
  delivery_notes: string | null;
  payment_method: PaymentMethodType;
  payment_status: PaymentStatusType;
  fulfillment_status: FulfillmentStatusType;
  subtotal: number;
  delivery_fee: number;
  discount_total: number;
  grand_total: number;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  stock_restored?: boolean;
  ip_address?: string | null;
  items?: OrderItem[];
  payments?: PaymentRecord[];
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  payment_method: PaymentMethodType;
  amount: number;
  sender_phone?: string | null;
  transaction_id?: string | null;
  bank_account_info?: string | null;
  verification_notes?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface DeliveryRule {
  id: string;
  district_name_en: string;
  district_name_bn: string;
  delivery_fee: number;
  estimated_days: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageSlide {
  id: string;
  title_en: string;
  title_bn: string;
  subtitle_en: string | null;
  subtitle_bn: string | null;
  cta_text_en: string;
  cta_text_bn: string;
  cta_url: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  general_settings: {
    brand_name_en: string;
    brand_name_bn: string;
    tagline_en: string;
    tagline_bn: string;
    contact_phone: string;
    contact_email: string;
    office_address_en: string;
    office_address_bn: string;
    free_shipping_threshold: number;
    announcement_en: string;
    announcement_bn: string;
  };
  payment_settings: {
    cod_enabled: boolean;
    bkash_enabled: boolean;
    bkash_number: string;
    bkash_type: string;
    bkash_instructions_en: string;
    bkash_instructions_bn: string;
    nagad_enabled: boolean;
    nagad_number: string;
    nagad_type: string;
    nagad_instructions_en: string;
    nagad_instructions_bn: string;
    rocket_enabled: boolean;
    rocket_number: string;
    rocket_type: string;
    rocket_instructions_en: string;
    rocket_instructions_bn: string;
    bank_enabled: boolean;
    bank_name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_branch: string;
    bank_instructions_en: string;
    bank_instructions_bn: string;
  };
  social_links: {
    facebook: string;
    youtube: string;
    instagram: string;
    whatsapp: string;
  };
}

export interface CartItem {
  id: string; // unique key (e.g. productId or productId_variantId)
  product_id: string;
  variant_id: string | null;
  name_en: string;
  name_bn: string;
  variant_name_en?: string;
  variant_name_bn?: string;
  sku: string;
  price: number;
  regular_price: number;
  quantity: number;
  max_stock: number;
  image_url: string;
}
