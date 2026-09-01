'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  ClipboardList,
  ChevronDown,
  Leaf,
  Hammer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
  ];

  const catalogueLinks = [
    { name: 'Moss Based Gifting', href: '/catalogue', desc: 'All eco gift categories', icon: Leaf },
    { name: 'Personalised Woodwork', href: '/woodwork', desc: 'Engraved timber keepsakes', icon: Hammer },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none flex justify-center">
      <div 
        className="pointer-events-auto w-full max-w-5xl rounded-full bg-[#101C15] border border-white/10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7)] py-2.5 sm:py-3 px-4 sm:px-6 transition-all duration-300"
      >
        <div className="relative flex items-center justify-between">
          {/* Brand Logo (Left) */}
          <Link href="/" className="flex items-center gap-2.5 group relative z-10 shrink-0">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Virsaa Gifts Logo"
                width={1700}
                height={1900}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation (Directly centered, no outer wrapper box) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans py-1 relative ${
                    isActive 
                      ? 'text-[#E4B58A] font-bold' 
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C88B56] to-[#E4B58A] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Catalogue hover dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans py-1 ${
                  pathname === '/catalogue' || pathname === '/woodwork'
                    ? 'text-[#E4B58A] font-bold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Catalogue
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <span
                className={`absolute left-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-[#C88B56] to-[#E4B58A] rounded-full transition-all duration-300 ${
                  pathname === '/catalogue' || pathname === '/woodwork' ? 'left-0 right-0' : 'left-1/2 right-1/2'
                }`}
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto pointer-events-none transition-all duration-200">
                <div className="w-64 bg-[#101C15] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]">
                  {catalogueLinks.map((cl) => {
                    const Icon = cl.icon;
                    const isItemActive = pathname === cl.href;
                    return (
                      <Link
                        key={cl.href}
                        href={cl.href}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                          isItemActive ? 'bg-[#C88B56]/15' : 'hover:bg-white/10'
                        }`}
                      >
                        <span className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isItemActive ? 'bg-[#C88B56]/25 text-[#E4B58A]' : 'bg-white/10 text-stone-300'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span>
                          <span className={`block text-xs font-bold ${isItemActive ? 'text-[#E4B58A]' : 'text-white'}`}>
                            {cl.name}
                          </span>
                          <span className="block text-[10px] text-stone-400 font-sans leading-snug mt-0.5">
                            {cl.desc}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* About link (after Catalogue) */}
            {[
              { name: 'About', href: '/about' },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans py-1 relative ${
                    isActive 
                      ? 'text-[#E4B58A] font-bold' 
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C88B56] to-[#E4B58A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden md:flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => {
                if (user) {
                  router.push('/dashboard');
                } else {
                  openAuthModal();
                }
              }}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C88B56] to-[#A86F3E] text-white hover:brightness-105 active:scale-98 text-xs font-bold uppercase tracking-wide font-sans transition-all duration-300 flex items-center gap-2 border border-[#E4B58A]/40"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Track Enquiry</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 relative z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 text-stone-200 hover:text-[#E4B58A] hover:bg-white/15 transition-all duration-300 active:scale-90"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-white/10 text-white animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center ${
                      isActive
                        ? 'bg-[#C88B56]/25 text-[#E4B58A] border border-[#C88B56]/40 font-bold'
                        : 'text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="px-4 pt-1 text-[10px] font-bold uppercase tracking-wider text-center text-stone-500">
                Catalogue
              </div>
              {catalogueLinks.map((cl) => {
                const isActive = pathname === cl.href;
                return (
                  <Link
                    key={cl.href}
                    href={cl.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center ${
                      isActive
                        ? 'bg-[#C88B56]/25 text-[#E4B58A] border border-[#C88B56]/40 font-bold'
                        : 'text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cl.name}
                  </Link>
                );
              })}

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center ${
                  pathname === '/about'
                    ? 'bg-[#C88B56]/25 text-[#E4B58A] border border-[#C88B56]/40 font-bold'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                About
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    router.push('/dashboard');
                  } else {
                    openAuthModal();
                  }
                }}
                className="w-full mt-2 py-2.5 rounded-full bg-gradient-to-r from-[#C88B56] to-[#A86F3E] text-white font-bold text-xs uppercase tracking-wider font-sans flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Track Enquiry</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}