-- =========================================================================
-- VirSaa Gifts Complete Database Schema & Row Level Security (RLS)
-- Run this in Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE product_tier AS ENUM ('Essential', 'Premium', 'Signature', 'Luxury', 'Executive', 'Artisan Luxe', 'Eco Essentials');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE speed_type AS ENUM ('Ready to Ship', '3-5 Days', '7-10 Days', 'Custom Made (14 Days)', 'Fast', 'Medium', 'Slow');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enquiry_status AS ENUM ('New', 'In Review', 'Replied', 'Closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sender_role AS ENUM ('customer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COLLECTIONS
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  banner_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  gst_percent NUMERIC(4, 2) DEFAULT 5,
  description TEXT,
  specification JSONB DEFAULT '{}'::jsonb,
  primary_use_case TEXT,
  secondary_use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  material_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  tier product_tier DEFAULT 'Essential',
  speed speed_type DEFAULT '3-5 Days',
  featured BOOLEAN DEFAULT false,
  min_order_qty INTEGER DEFAULT 10,
  collections TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  image_type TEXT DEFAULT 'primary' CHECK (image_type IN ('primary', 'gallery', 'packaging', 'craft')),
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENQUIRIES
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY DEFAULT ('enq-' || floor(extract(epoch from now()))),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_sku TEXT,
  product_name TEXT,
  product_image TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 20,
  customization_requirements TEXT,
  message TEXT NOT NULL,
  status enquiry_status DEFAULT 'New',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ENQUIRY MESSAGES
CREATE TABLE IF NOT EXISTS public.enquiry_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || floor(extract(epoch from now()))),
  enquiry_id TEXT REFERENCES public.enquiries(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  sender_type sender_role DEFAULT 'customer',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || floor(extract(epoch from now()))),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enquiry_id TEXT REFERENCES public.enquiries(id) ON DELETE CASCADE,
  title TEXT,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_tier ON public.products(tier);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_user_id ON public.enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);

-- Admin CRUD policies (Service role / authenticated admins)
CREATE POLICY "Admin All Products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Product Images" ON public.product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Collections" ON public.collections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enquiries Policies
CREATE POLICY "Insert Enquiry Any" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users View Own Enquiries" ON public.enquiries FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Users View Own Messages" ON public.enquiry_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.enquiries
    WHERE public.enquiries.id = public.enquiry_messages.enquiry_id
    AND (public.enquiries.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'service_role')
  ));
CREATE POLICY "Users Post Own Messages" ON public.enquiry_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.enquiries
    WHERE public.enquiries.id = public.enquiry_messages.enquiry_id
    AND (public.enquiries.user_id = auth.uid() OR auth.uid() IS NULL)
  ));
