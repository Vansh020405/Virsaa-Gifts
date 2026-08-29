'use client';

import React from 'react';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loginAsDemoAdmin } = useAuth();

  // If user is not admin, show graceful access screen with 1-click admin toggle
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#12211B] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A2E26] p-8 rounded-3xl border border-[#C88B56]/30 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C88B56]/20 border border-[#C88B56]/40 flex items-center justify-center mx-auto mb-4 text-[#E4B58A]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl font-bold mb-2">Admin Access</h2>
          <p className="text-stone-300 text-xs sm:text-sm mb-6 leading-relaxed">
            This area is for administrators. Sign in with the demo admin account to continue.
          </p>

          <button
            onClick={loginAsDemoAdmin}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#C88B56] hover:bg-[#b67843] text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 mb-3"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in as Admin</span>
          </button>

          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-white underline underline-offset-4"
          >
            Return to Customer Website
          </Link>
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
