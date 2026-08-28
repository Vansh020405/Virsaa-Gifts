'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithEmail, loginAsDemoUser, loginAsDemoAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await loginWithEmail(email, name, 'customer');
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1F332B] text-white p-6 text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-[#C88B56]/20 border border-[#C88B56]/40 flex items-center justify-center mx-auto mb-2 text-[#E4B58A]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold">
            {isRegister ? 'Join VirSaa Gifts' : 'Sign in to VirSaa'}
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Track your bespoke corporate enquiries & collaborate with our master artisans
          </p>
        </div>

        {/* Demo Fast Logins for instant evaluation */}
        <div className="p-6 pb-2">
          <div className="p-3 bg-[#F0EAE1] rounded-2xl border border-[#E2D8CA] mb-5">
            <p className="text-[11px] font-bold text-[#1F332B] uppercase tracking-wider mb-2 text-center">
              ⚡ 1-Click Evaluation Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginAsDemoUser}
                className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#DCD1C4] text-[#1F332B] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition"
              >
                <User className="w-3.5 h-3.5 text-[#C88B56]" />
                Customer Demo
              </button>
              <button
                type="button"
                onClick={loginAsDemoAdmin}
                className="py-2 px-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition"
              >
                <Shield className="w-3.5 h-3.5 text-[#E4B58A]" />
                Admin Portal
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#E8DFC8] w-full" />
            <span className="bg-[#FAF8F5] px-3 text-xs text-stone-500 uppercase tracking-wider font-medium absolute">
              Or with credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-sm focus:outline-hidden focus:border-[#C88B56]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F332B] mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-sm focus:outline-hidden focus:border-[#C88B56]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F332B] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-sm focus:outline-hidden focus:border-[#C88B56]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1F332B] text-white font-bold text-sm hover:bg-[#2D4A3E] transition flex items-center justify-center gap-1.5 shadow-sm mt-2"
            >
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-4 mb-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#C88B56] hover:underline font-semibold"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account yet? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
