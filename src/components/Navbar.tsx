'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Menu, 
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export default function Navbar({ onOpenEnquiry }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pressedNav, setPressedNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#121F16]/90 backdrop-blur-md shadow-xl shadow-black/20 border-b border-[#C88B56]/25 py-3.5'
          : 'bg-[#121F16] border-b border-white/10 py-4'
      }`}
    >
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
          <div className="hidden lg:flex items-center gap-4">
            {/* Primary Action: Send Enquiry (Premium) */}
            <button
              onClick={onOpenEnquiry}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C88B56] via-[#D9A45E] to-[#C88B56] text-[#12211B] text-xs font-bold uppercase tracking-wide font-sans border border-[#E4B58A]/70 hover:shadow-md hover:shadow-[#C88B56]/40 hover:brightness-110 active:scale-95 transition-all duration-500 ease-in-out flex items-center gap-2"
            >
              
              <span>Send Enquiry</span>
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
                  onOpenEnquiry?.();
                }}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#C88B56] via-[#D9A45E] to-[#C88B56] text-[#12211B] font-bold text-sm uppercase tracking-wide font-sans flex items-center justify-center gap-2 hover:shadow-md hover:shadow-[#C88B56]/40 transition-all duration-500 ease-in-out hover:brightness-110 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                Send Bespoke Corporate Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}