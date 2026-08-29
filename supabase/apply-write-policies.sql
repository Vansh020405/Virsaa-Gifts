-- =============================================================================
-- Virsaa Gifts — Enable demo writes (RUN THIS IN SUPABASE SQL EDITOR)
-- The client-side admin panel and customer ⇄ admin enquiry threads run with
-- the anon key, so the tables need permissive write policies. Idempotent.
-- Prepared for a demo; tighten before production.
-- =============================================================================

alter table public.products         enable row level security;
alter table public.product_images   enable row level security;
alter table public.categories       enable row level security;
alter table public.collections      enable row level security;
alter table public.enquiries        enable row level security;
alter table public.enquiry_messages enable row level security;

-- PRODUCTS -------------------------------------------------------------------
drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (true);
drop policy if exists "Admin insert products" on public.products;
create policy "Admin insert products" on public.products for insert with check (true);
drop policy if exists "Admin update products" on public.products;
create policy "Admin update products" on public.products for update using (true) with check (true);
drop policy if exists "Admin delete products" on public.products;
create policy "Admin delete products" on public.products for delete using (true);

-- PRODUCT IMAGES -------------------------------------------------------------
drop policy if exists "Public read product images" on public.product_images;
create policy "Public read product images" on public.product_images for select using (true);
drop policy if exists "Admin insert product images" on public.product_images;
create policy "Admin insert product images" on public.product_images for insert with check (true);
drop policy if exists "Admin update product images" on public.product_images;
create policy "Admin update product images" on public.product_images for update using (true) with check (true);
drop policy if exists "Admin delete product images" on public.product_images;
create policy "Admin delete product images" on public.product_images for delete using (true);

-- ENQUIRIES ------------------------------------------------------------------
drop policy if exists "Public read enquiries" on public.enquiries;
create policy "Public read enquiries" on public.enquiries for select using (true);
drop policy if exists "Public insert enquiries" on public.enquiries;
create policy "Public insert enquiries" on public.enquiries for insert with check (true);
drop policy if exists "Admin update enquiries" on public.enquiries;
create policy "Admin update enquiries" on public.enquiries for update using (true) with check (true);
drop policy if exists "Admin delete enquiries" on public.enquiries;
create policy "Admin delete enquiries" on public.enquiries for delete using (true);

-- ENQUIRY MESSAGES -----------------------------------------------------------
drop policy if exists "Public read enquiry messages" on public.enquiry_messages;
create policy "Public read enquiry messages" on public.enquiry_messages for select using (true);
drop policy if exists "Public insert enquiry messages" on public.enquiry_messages;
create policy "Public insert enquiry messages" on public.enquiry_messages for insert with check (true);
drop policy if exists "Admin update enquiry messages" on public.enquiry_messages;
create policy "Admin update enquiry messages" on public.enquiry_messages for update using (true) with check (true);
drop policy if exists "Admin delete enquiry messages" on public.enquiry_messages;
create policy "Admin delete enquiry messages" on public.enquiry_messages for delete using (true);

-- CATEGORIES / COLLECTIONS ---------------------------------------------------
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);
drop policy if exists "Admin write categories" on public.categories;
create policy "Admin write categories" on public.categories for all using (true) with check (true);

drop policy if exists "Public read collections" on public.collections;
create policy "Public read collections" on public.collections for select using (true);
drop policy if exists "Admin write collections" on public.collections;
create policy "Admin write collections" on public.collections for all using (true) with check (true);

-- STORAGE: allow public uploads to product-images (admin image uploads) -------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product image files" on storage.objects;
create policy "Public read product image files"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Any upload product image files" on storage.objects;
create policy "Any upload product image files"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

drop policy if exists "Any update product image files" on storage.objects;
create policy "Any update product image files"
  on storage.objects for update
  using (bucket_id = 'product-images');

drop policy if exists "Any delete product image files" on storage.objects;
create policy "Any delete product image files"
  on storage.objects for delete
  using (bucket_id = 'product-images');