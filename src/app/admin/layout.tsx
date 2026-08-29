'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { verifyAdminCredentials, verifyAdmin2FA } from '../../lib/supabase/admin-auth';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loginAsDemoAdmin } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await verifyAdminCredentials(email, password);
      if (!res.ok) {
        setError(res.error || 'Invalid credentials.');
        setBusy(false);
        return;
      }
      setStep(2);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await verifyAdmin2FA(email, code);
      if (!res.ok) {
        setError(res.error || 'Invalid code.');
        setBusy(false);
        return;
      }
      loginAsDemoAdmin();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const backToCredentials = () => {
    setStep(1);
    setCode('');
    setError('');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#12211B] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A2E26] p-8 rounded-3xl border border-[#C88B56]/30 shadow-2xl">
          {step === 1 ? (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#C88B56]/20 border border-[#C88B56]/40 flex items-center justify-center mx-auto mb-4 text-[#E4B58A]">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-sans text-2xl font-bold mb-2 text-center">Admin Access</h2>
              <p className="text-stone-300 text-xs sm:text-sm mb-6 text-center leading-relaxed">
                This area is for administrators only. Enter your admin credentials to continue.
              </p>

              <form onSubmit={handleCredentialSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@virsaagifts.com"
                    className="w-full bg-[#12211B] border border-[#C88B56]/25 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#C88B56]"
                  />
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#12211B] border border-[#C88B56]/25 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-[#C88B56]"
                  />
                </div>

                {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#C88B56] hover:bg-[#b67843] disabled:opacity-60 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <span>Verifying…</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-stone-400 text-[11px] mt-4 text-center">
                Two-factor authentication is enabled. You&apos;ll enter a code from your authenticator app next.
              </p>
              <div className="text-center mt-4">
                <Link href="/" className="text-xs text-stone-400 hover:text-white underline underline-offset-4">
                  Return to Customer Website
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#C88B56]/20 border border-[#C88B56]/40 flex items-center justify-center mx-auto mb-4 text-[#E4B58A]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-sans text-2xl font-bold mb-2 text-center">Two-Factor Verification</h2>
              <p className="text-stone-300 text-xs sm:text-sm mb-6 text-center leading-relaxed">
                Enter the 6-digit code from your authenticator app for <span className="text-white font-medium">{email}</span>.
              </p>

              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center tracking-[0.5em] bg-[#12211B] border border-[#C88B56]/25 rounded-2xl py-3 px-4 text-xl font-bold text-white placeholder:text-stone-500 focus:outline-none focus:border-[#C88B56]"
                  />
                </div>

                {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={busy || code.length !== 6}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#C88B56] hover:bg-[#b67843] disabled:opacity-60 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <span>Verifying…</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify &amp; continue</span>
                    </>
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={backToCredentials}
                className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Use a different account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {children}
      </div>
    </div>
  );
}