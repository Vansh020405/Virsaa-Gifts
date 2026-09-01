-- =========================================================================
-- VirSaa Gifts — Enquiry attachments & personalization text
-- Run this once in the Supabase SQL editor to sync an existing database.
-- Idempotent: safe to re-run.
--
-- Adds:
--   * personalization_text  (text)   — text the customer wants printed/engraved
--   * attachments           (text[]) — public URLs of reference images
--   * enquiry-attachments storage bucket + read/insert/update/delete policies
-- =========================================================================

alter table public.enquiries
  add column if not exists personalization_text text,
  add column if not exists attachments text[];

insert into storage.buckets (id, name, public)
values ('enquiry-attachments', 'enquiry-attachments', true)
on conflict (id) do nothing;

drop policy if exists "Public read enquiry attachment files" on storage.objects;
create policy "Public read enquiry attachment files"
  on storage.objects for select
  using (bucket_id = 'enquiry-attachments');

drop policy if exists "Any upload enquiry attachment files" on storage.objects;
create policy "Any upload enquiry attachment files"
  on storage.objects for insert
  with check (bucket_id = 'enquiry-attachments');

drop policy if exists "Any update enquiry attachment files" on storage.objects;
create policy "Any update enquiry attachment files"
  on storage.objects for update
  using (bucket_id = 'enquiry-attachments');

drop policy if exists "Any delete enquiry attachment files" on storage.objects;
create policy "Any delete enquiry attachment files"
  on storage.objects for delete
  using (bucket_id = 'enquiry-attachments');