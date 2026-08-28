'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'About', href: '/about' },
  ];

  const isDarkHero = false;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-xs border-b border-[#E8DFC8]/60 py-3.5'
          : 'bg-[#FAF8F5] border-b border-[#E8DFC8] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C88B56] to-[#1F332B] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="font-cinzel text-lg font-bold tracking-widest">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-cinzel text-xl font-bold tracking-wider ${isDarkHero ? 'text-white' : 'text-[#1F332B]'}`}>
                  Virsaa
                </span>
                <span className="text-[#C88B56] text-xs uppercase tracking-widest font-semibold">GIFTS</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#C88B56] relative py-1 ${
                    isDarkHero
                      ? isActive ? 'text-[#E4B58A] font-semibold' : 'text-stone-200'
                      : isActive ? 'text-[#1F332B] font-semibold' : 'text-[#4A3B32]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C88B56] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Primary Action: Send Enquiry */}
            <button
              onClick={onOpenEnquiry}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#C88B56] to-[#B67742] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span>Send Enquiry</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isDarkHero ? 'text-white' : 'text-[#1F332B]'}`}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-t border-[#E8DFC8] mt-3 py-4 px-2 rounded-2xl shadow-2xl text-[#1F332B] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#EFE9DE] transition"
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry?.();
                }}
                className="w-full mt-2 py-3 rounded-xl bg-[#1F332B] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#C88B56]" />
                Send Bespoke Corporate Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
