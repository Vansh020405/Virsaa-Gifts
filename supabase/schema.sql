-- =============================================================================
-- Virsaa Gifts — Supabase Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard > SQL).
-- It creates every table the app expects, enables RLS with permissive policies,
-- and creates the public `product-images` storage bucket.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PROFILES (mirrors Auth users for demo/admin personas)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id            text primary key,
  name          text,
  email         text,
  phone         text,
  company_name  text,
  role          text not null default 'customer' check (role in ('customer', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- CATEGORIES
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- COLLECTIONS
-- -----------------------------------------------------------------------------
create table if not exists public.collections (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  banner_image text,
  created_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- PRODUCTS
-- NOTE: mirrors the live table — there is no category_name column; display
-- names are resolved from category_id on the client (see resolveCategoryName).
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                  text primary key,
  sku                 text not null unique,
  name                text not null,
  category_id         text references public.categories(id),
  subcategory         text,
  price               numeric not null default 0,
  gst_percent         integer not null default 18,
  description         text,
  specification       jsonb not null default '{}'::jsonb,
  primary_use_case    text,
  secondary_use_cases jsonb not null default '[]'::jsonb,
  material_tags       jsonb not null default '[]'::jsonb,
  tier                text,
  speed               text,
  featured            boolean not null default false,
  min_order_qty       integer,
  collections         jsonb not null default '[]'::jsonb,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- PRODUCT IMAGES (one-to-many: allows multiple uploads per product)
-- -----------------------------------------------------------------------------
create table if not exists public.product_images (
  id          text primary key,
  product_id  text not null references public.products(id) on delete cascade,
  storage_path text not null,
  image_type  text not null default 'gallery' check (image_type in ('primary', 'gallery', 'packaging', 'craft')),
  sort_order  integer not null default 1,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- -----------------------------------------------------------------------------
-- ENQUIRIES (customer proposals → admin dashboard)
-- -----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id                       text primary key,
  user_id                  text,
  product_id               text,
  product_sku              text,
  product_name             text,
  product_image            text,
  name                     text not null,
  email                    text not null,
  phone                    text,
  company_name             text,
  quantity                 integer not null default 20,
  customization_requirements text,
  message                  text,
  status                   text not null default 'New' check (status in ('New', 'In Review', 'Replied', 'Closed')),
  admin_notes              text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);

-- -----------------------------------------------------------------------------
-- ENQUIRY MESSAGES (customer ⇄ admin thread)
-- -----------------------------------------------------------------------------
create table if not exists public.enquiry_messages (
  id          text primary key,
  enquiry_id  text not null references public.enquiries(id) on delete cascade,
  sender_id   text,
  sender_name text,
  sender_type text not null default 'customer' check (sender_type in ('customer', 'admin')),
  message     text,
  created_at  timestamptz not null default now()
);

create index if not exists enquiry_messages_enquiry_id_idx on public.enquiry_messages (enquiry_id);

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS
-- -----------------------------------------------------------------------------
create table if not exists public.notifications (
  id         text primary key,
  user_id    text,
  enquiry_id text,
  title      text,
  type       text default 'new_enquiry',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- The catalogue is a public storefront; enquiries are lightweight guest forms.
-- Policies are intentionally permissive for the demo (public reads/writes).
-- Switch to authenticated-only policies before production launch.
-- =============================================================================
alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.collections     enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.enquiries       enable row level security;
alter table public.enquiry_messages enable row level security;
alter table public.notifications   enable row level security;

drop policy if exists "Categories public read" on public.categories;
create policy "Categories public read" on public.categories for select using (true);

drop policy if exists "Collections public read" on public.collections;
create policy "Collections public read" on public.collections for select using (true);

drop policy if exists "Products public read" on public.products;
create policy "Products public read" on public.products for select using (true);

drop policy if exists "Products admin maintain" on public.products;
create policy "Products admin maintain" on public.products for all using (true) with check (true);

drop policy if exists "Product images public read" on public.product_images;
create policy "Product images public read" on public.product_images for select using (true);

drop policy if exists "Product images admin maintain" on public.product_images;
create policy "Product images admin maintain" on public.product_images for all using (true) with check (true);

drop policy if exists "Enquiries public read" on public.enquiries;
create policy "Enquiries public read" on public.enquiries for select using (true);

drop policy if exists "Enquiries public insert" on public.enquiries;
create policy "Enquiries public insert" on public.enquiries for insert with check (true);

drop policy if exists "Enquiries public update" on public.enquiries;
create policy "Enquiries public update" on public.enquiries for update using (true) with check (true);

drop policy if exists "Enquiry messages public read" on public.enquiry_messages;
create policy "Enquiry messages public read" on public.enquiry_messages for select using (true);

drop policy if exists "Enquiry messages public insert" on public.enquiry_messages;
create policy "Enquiry messages public insert" on public.enquiry_messages for insert with check (true);

drop policy if exists "Enquiry messages public update" on public.enquiry_messages;
create policy "Enquiry messages public update" on public.enquiry_messages for update using (true) with check (true);

drop policy if exists "Profiles public read" on public.profiles;
create policy "Profiles public read" on public.profiles for select using (true);

drop policy if exists "Profiles public maintain" on public.profiles;
create policy "Profiles public maintain" on public.profiles for all using (true) with check (true);

drop policy if exists "Notifications public read" on public.notifications;
create policy "Notifications public read" on public.notifications for select using (true);

drop policy if exists "Notifications public maintain" on public.notifications;
create policy "Notifications public maintain" on public.notifications for all using (true) with check (true);

-- =============================================================================
-- STORAGE: public `product-images` bucket
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admin upload product images" on storage.objects;
create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

drop policy if exists "Admin update product images" on storage.objects;
create policy "Admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');

drop policy if exists "Admin delete product images" on storage.objects;
create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');