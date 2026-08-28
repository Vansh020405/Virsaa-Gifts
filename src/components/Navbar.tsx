'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  MessageSquareText, 
  LogOut, 
  Layers,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export default function Navbar({ onOpenEnquiry }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAdmin, logout, openAuthModal, loginAsDemoAdmin, loginAsDemoUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    { name: 'Materials & Craft', href: '/#materials' },
    { name: 'Why VirSaa', href: '/#why-virsaa' },
  ];

  const isDarkHero = pathname === '/' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-xs border-b border-[#E8DFC8]/60 py-3.5'
          : pathname === '/'
          ? 'bg-gradient-to-b from-[#12211B]/90 to-transparent py-5 text-white'
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
                  VIRSAA
                </span>
                <span className="text-[#C88B56] text-xs uppercase tracking-widest font-semibold">GIFTS</span>
              </div>
              <p className={`text-[10px] tracking-widest uppercase font-medium ${isDarkHero ? 'text-stone-300' : 'text-stone-500'}`}>
                Gifts That Carry Your Story
              </p>
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
            {/* Quick Demo Switcher Tag */}
            <div className="flex items-center gap-1.5 bg-[#EFE9DE]/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#DCD1C4] text-[11px] text-[#4A3B32]">
              <span className="text-stone-500">Role:</span>
              <button
                onClick={loginAsDemoUser}
                className={`px-1.5 py-0.5 rounded transition ${user?.role === 'customer' ? 'bg-[#1F332B] text-white font-semibold' : 'hover:text-[#1F332B]'}`}
              >
                Customer
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={loginAsDemoAdmin}
                className={`px-1.5 py-0.5 rounded transition ${user?.role === 'admin' ? 'bg-[#C88B56] text-white font-semibold' : 'hover:text-[#C88B56]'}`}
              >
                Admin
              </button>
            </div>

            {/* Admin Portal Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#C88B56]/15 text-[#9E5A38] border border-[#C88B56]/30 hover:bg-[#C88B56] hover:text-white transition-all shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}

            {/* User Account / Enquiries */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border transition ${
                    isDarkHero
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-[#DCD1C4] text-[#1F332B] hover:bg-[#EFE9DE]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#1F332B] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E8DFC8] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#F0EAE1]">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-semibold text-[#1F332B] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-bold bg-[#FAF8F5] text-[#C88B56] border border-[#E8DFC8]">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#4A3B32] hover:bg-[#FAF8F5] hover:text-[#1F332B] transition"
                    >
                      <MessageSquareText className="w-4 h-4 text-[#C88B56]" />
                      My Enquiries & Chat
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#9E5A38] hover:bg-[#FAF8F5] transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C88B56]" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-[#F0EAE1] mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${
                  isDarkHero
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-[#DCD1C4] text-[#1F332B] hover:bg-[#EFE9DE]'
                }`}
              >
                Sign In
              </button>
            )}

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

              <div className="border-t border-[#E8DFC8] my-2 pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#EFE9DE] transition"
                >
                  <MessageSquareText className="w-4 h-4 text-[#C88B56]" />
                  My Enquiries & Live Status
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#9E5A38] hover:bg-[#EFE9DE] transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Portal & Inquiries
                </Link>
              </div>

              <div className="p-3 bg-[#EFE9DE] rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-stone-600">Switch Demo Persona:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      loginAsDemoUser();
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${user?.role === 'customer' ? 'bg-[#1F332B] text-white' : 'bg-white'}`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${user?.role === 'admin' ? 'bg-[#C88B56] text-white' : 'bg-white'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

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
