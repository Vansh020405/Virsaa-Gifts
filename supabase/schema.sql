-- =========================================================================
-- VirSaa Gifts Database Schema & Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE product_tier AS ENUM ('Signature', 'Executive', 'Artisan Luxe', 'Eco Essentials');
CREATE TYPE speed_type AS ENUM ('Ready to Ship', '3-5 Days', '7-10 Days', 'Custom Made (14 Days)');
CREATE TYPE enquiry_status AS ENUM ('New', 'In Review', 'Replied', 'Closed');
CREATE TYPE sender_role AS ENUM ('customer', 'admin');

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
  id TEXT PRIMARY KEY DEFAULT ('prod-' || floor(extract(epoch from now()))),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  gst_percent NUMERIC(4, 2) DEFAULT 18,
  description TEXT,
  specification JSONB DEFAULT '{}'::jsonb,
  primary_use_case TEXT,
  secondary_use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  material_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  tier product_tier DEFAULT 'Signature',
  speed speed_type DEFAULT '3-5 Days',
  featured BOOLEAN DEFAULT false,
  min_order_qty INTEGER DEFAULT 10,
  collections TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id TEXT PRIMARY KEY DEFAULT ('img-' || floor(extract(epoch from now()))),
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

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

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

-- Anyone can submit an enquiry
CREATE POLICY "Insert Enquiry Any" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Users can view their own enquiries
CREATE POLICY "Users View Own Enquiries" ON public.enquiries FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

-- Users can view their enquiry messages
CREATE POLICY "Users View Own Messages" ON public.enquiry_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.enquiries
    WHERE public.enquiries.id = public.enquiry_messages.enquiry_id
    AND public.enquiries.user_id = auth.uid()
  ));

-- Users can add messages to their own enquiry
CREATE POLICY "Users Post Own Messages" ON public.enquiry_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.enquiries
    WHERE public.enquiries.id = public.enquiry_messages.enquiry_id
    AND (public.enquiries.user_id = auth.uid() OR auth.uid() IS NULL)
  ));
