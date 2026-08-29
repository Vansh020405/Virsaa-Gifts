'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pressedNav, setPressedNav] = useState<string | null>(null);

  const triggerGoldFade = (name: string) => {
    setPressedNav(null);
    requestAnimationFrame(() => setPressedNav(name));
    setTimeout(() => setPressedNav(null), 600);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121F16] border-b border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/virsaa-logo.png"
              alt="Virsaa Gifts Logo"
              width={1474}
              height={1354}
              priority
              className="h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => triggerGoldFade(link.name)}
                  className={`text-sm font-medium relative py-1 transition-all duration-500 ease-in-out ${
                    isActive ? 'text-[#C88B56] font-semibold' : 'text-stone-100 hover:text-[#E4B58A]'
                  } ${pressedNav === link.name ? 'gold-fade' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Track Enquiry */}
            <button
              onClick={() => {
                if (user) {
                  router.push('/dashboard');
                } else {
                  openAuthModal();
                }
              }}
              className="px-6 py-2.5 rounded-full border border-[#C88B56]/50 text-[#E4B58A] hover:bg-[#C88B56]/10 hover:border-[#C88B56] text-xs font-bold uppercase tracking-wide font-sans transition-all duration-500 ease-in-out flex items-center gap-2 active:scale-95"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Track Enquiry</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:text-[#E4B58A] transition-all duration-300 ease-in-out"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0E1B16] border-t border-[#C88B56]/20 mt-3 py-4 px-2 rounded-2xl shadow-2xl text-white animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      triggerGoldFade(link.name);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-[#C88B56]/15 text-[#E4B58A] font-semibold'
                        : 'text-stone-200 hover:bg-white/10 hover:text-[#E4B58A]'
                    } ${pressedNav === link.name && mobileMenuOpen ? 'gold-fade' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    router.push('/dashboard');
                  } else {
                    openAuthModal();
                  }
                }}
                className="w-full mt-2 py-3 rounded-xl border border-[#C88B56]/50 text-[#E4B58A] font-bold text-sm uppercase tracking-wide font-sans flex items-center justify-center gap-2 transition-all duration-500 ease-in-out active:scale-[0.98]"
              >
                <ClipboardList className="w-4 h-4" />
                Track Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}