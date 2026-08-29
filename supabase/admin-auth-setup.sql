-- =============================================================================
-- Virsaa Gifts -- Admin Portal Credentials (2FA setup)
-- Paste this into the Supabase SQL Editor and run it.
-- Default login: admin@virsaagifts.com / Virsaa@2026
-- 2FA secret (add to Google Authenticator / Authy / 1Password as a TOTP item):
--   74AX7CSCI4YXFI6VFDM56RT5NMK52YWG
-- Secret key URI:
--   otpauth://totp/VirsaaGifts:admin@virsaagifts.com?secret=74AX7CSCI4YXFI6VFDM56RT5NMK52YWG&issuer=VirsaaGifts&algorithm=SHA1&digits=6&period=30
-- =============================================================================

create table if not exists public.admin_credentials (
  id                text primary key,
  email             text not null unique,
  password_salt     text not null,
  password_hash     text not null,
  two_factor_secret text not null,
  created_at        timestamptz not null default now()
);

insert into public.admin_credentials (id, email, password_salt, password_hash, two_factor_secret)
values (
  'cred-1',
  'admin@virsaagifts.com',
  'virsaa-admin-salt-v1',
  '6a93e16d52fec9c5eb4763099946c0f44c2e5c94f03f9d55e52fe6725319bd06',
  '74AX7CSCI4YXFI6VFDM56RT5NMK52YWG'
)
on conflict (id) do nothing;

alter table public.admin_credentials enable row level security;

drop policy if exists "Admin credentials public read" on public.admin_credentials;
create policy "Admin credentials public read" on public.admin_credentials for select using (true);