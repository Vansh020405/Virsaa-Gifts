import { supabase } from './client';
import { verifyTOTP } from './totp';

export type AdminVerificationResult = { ok: true } | { ok: false; error: string };

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

interface AdminCredentialRow {
  email: string;
  password_salt: string;
  password_hash: string;
  two_factor_secret?: string;
}

async function fetchAdminCredentials(email: string): Promise<AdminCredentialRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('admin_credentials')
    .select('email, password_salt, password_hash, two_factor_secret')
    .eq('email', email)
    .maybeSingle();
  if (error) return null;
  return (data as AdminCredentialRow) || null;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminVerificationResult> {
  const normalized = email.trim().toLowerCase();
  if (!supabase) {
    return { ok: false, error: 'Database is not configured. Add Supabase env vars and restart.' };
  }

  const row = await fetchAdminCredentials(normalized);
  if (!row) {
    return { ok: false, error: 'No admin account found for that email.' };
  }

  const expected = await sha256Hex(row.password_salt + password);
  if (expected !== row.password_hash) {
    return { ok: false, error: 'Incorrect password.' };
  }

  return { ok: true };
}

export async function verifyAdmin2FA(email: string, code: string): Promise<AdminVerificationResult> {
  const normalized = email.trim().toLowerCase();
  if (!supabase) {
    return { ok: false, error: 'Database is not configured. Add Supabase env vars and restart.' };
  }

  const row = await fetchAdminCredentials(normalized);
  if (!row?.two_factor_secret) {
    return { ok: false, error: '2FA is not configured for this account.' };
  }

  const valid = await verifyTOTP(row.two_factor_secret, code);
  if (!valid) {
    return { ok: false, error: 'Invalid code. Enter the 6-digit code from your authenticator app.' };
  }

  return { ok: true };
}