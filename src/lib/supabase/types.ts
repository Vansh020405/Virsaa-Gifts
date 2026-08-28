export type ProductTier = 'Essential' | 'Premium' | 'Signature' | 'Luxury' | 'Executive' | 'Artisan Luxe' | 'Eco Essentials';
export type SpeedType = 'Ready to Ship' | '3-5 Days' | '7-10 Days' | 'Custom Made (14 Days)' | 'Fast' | 'Medium' | 'Slow';
export type EnquiryStatus = 'New' | 'In Review' | 'Replied' | 'Closed';
export type UserRole = 'customer' | 'admin';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  image_type: 'primary' | 'gallery' | 'packaging' | 'craft';
  sort_order: number;
  created_at?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category_id: string;
  category_name?: string;
  subcategory: string;
  price: number;
  gst_percent: number;
  description: string;
  specification: {
    dimensions?: string;
    weight?: string;
    finish?: string;
    packaging?: string;
    customization_options?: string[];
    origin?: string;
    eco_impact?: string;
  };
  primary_use_case: string;
  secondary_use_cases: string[];
  material_tags: string[]; // ['Wood', 'Bamboo', 'Cork', 'MDF', 'Moss', 'Brass', etc.]
  tier: ProductTier;
  speed: SpeedType;
  featured?: boolean;
  min_order_qty?: number;
  images?: ProductImage[];
  collections?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  role: UserRole;
  created_at?: string;
}

export interface EnquiryMessage {
  id: string;
  enquiry_id: string;
  sender_id: string;
  sender_name?: string;
  sender_type: 'customer' | 'admin';
  message: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  user_id?: string | null;
  product_id?: string;
  product_sku?: string;
  product_name?: string;
  product_image?: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  quantity: number;
  customization_requirements?: string;
  message: string;
  status: EnquiryStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  messages?: EnquiryMessage[];
}

export interface Notification {
  id: string;
  user_id?: string;
  enquiry_id?: string;
  title?: string;
  type: 'new_enquiry' | 'enquiry_reply' | 'status_change';
  read: boolean;
  created_at: string;
}
