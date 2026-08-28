'use client';

import React, { useState } from 'react';
import { Settings, Database, ShieldCheck, Check, Key, Bell } from 'lucide-react';
import { isSupabaseConfigured } from '../../../lib/supabase/client';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-8 space-y-6 max-w-4xl w-full mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Credentials</span>
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#1F332B]">Platform Settings</h1>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1F332B]">Database Status</h3>
              <p className="text-xs text-stone-500">
                {isSupabaseConfigured
                  ? 'Connected to live Supabase project'
                  : 'Operating in High-Performance Local / LocalStorage Mode with Instant Sync'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
            Active
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-[#1F332B] uppercase tracking-wider text-[11px]">
            Supabase Connection Variables (.env.local)
          </h4>
          <div>
            <label className="block text-stone-500 mb-1">NEXT_PUBLIC_SUPABASE_URL</label>
            <input
              type="text"
              readOnly
              value={process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://[your-project].supabase.co'}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-600"
            />
          </div>
          <div>
            <label className="block text-stone-500 mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
            <input
              type="password"
              readOnly
              value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '••••••••••••••••' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-600"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs text-stone-600 space-y-1.5">
          <p className="font-bold text-[#1F332B]">📋 Supabase Schema Setup:</p>
          <p>
            The complete SQL schema with RLS and trigger policies is generated in <code className="font-mono text-[#C88B56]">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
