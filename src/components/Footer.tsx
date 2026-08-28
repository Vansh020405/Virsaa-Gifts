'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Heart, ShieldCheck, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#12211B] text-stone-300 border-t border-[#233B31]">
      {/* Top CTA Banner */}
      <div className="border-b border-[#233B31] py-12 bg-gradient-to-b from-[#172A22] to-[#12211B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#E4B58A] text-xs uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Bespoke Corporate Studio</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-white font-bold">
              Ready to elevate your corporate gifting experience?
            </h3>
            <p className="text-sm text-stone-400 mt-1 max-w-xl">
              Connect with our artisan curators to receive custom digital 3D renders and physical prototype hampers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="px-6 py-3 rounded-full bg-[#C88B56] hover:bg-[#b57741] text-white text-sm font-bold shadow-lg transition"
            >
              Browse 2026 Catalogue
            </Link>
            <Link
              href="/#contact-cta"
              className="px-6 py-3 rounded-full border border-stone-600 hover:bg-white/10 text-white text-sm font-medium transition"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C88B56] to-[#1F332B] flex items-center justify-center text-white">
                <span className="font-cinzel text-lg font-bold">V</span>
              </div>
              <span className="font-cinzel text-xl font-bold tracking-wider text-white">
                VIRSAA <span className="text-[#C88B56] text-xs">GIFTS</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              VirSaa Gifts creates premium, personalized and sustainable gifts using wood, MDF, cork, bamboo and preserved moss décor. Combining Indian artisan craftsmanship, personalization, and emotional connection.
            </p>
            <p className="text-xs text-[#E4B58A] italic font-serif">
              “Gifts That Carry Your Story.”
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> 100% Plastic Free
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E4B58A]" /> GST Compliant B2B Invoicing
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalogue" className="hover:text-[#E4B58A] transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=home-decor" className="hover:text-[#E4B58A] transition">
                  Preserved Moss & Décor
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=stationery" className="hover:text-[#E4B58A] transition">
                  Bamboo & Cork Folios
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=tableware" className="hover:text-[#E4B58A] transition">
                  Sheesham & Brass Tableware
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=corporate-gifting" className="hover:text-[#E4B58A] transition">
                  Luxury Heritage Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Materials & Craft
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalogue?material=Wood" className="hover:text-[#E4B58A] transition">
                  Reclaimed Sheesham & Teak
                </Link>
              </li>
              <li>
                <Link href="/catalogue?material=Moss" className="hover:text-[#E4B58A] transition">
                  Icelandic Botanical Moss
                </Link>
              </li>
              <li>
                <Link href="/catalogue?material=Cork" className="hover:text-[#E4B58A] transition">
                  Natural Renewable Cork
                </Link>
              </li>
              <li>
                <Link href="/catalogue?material=Bamboo" className="hover:text-[#E4B58A] transition">
                  Organic Lidded Bamboo
                </Link>
              </li>
              <li>
                <Link href="/catalogue?material=MDF" className="hover:text-[#E4B58A] transition">
                  Zero-Emission Eco MDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Concierge Studio
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C88B56] shrink-0 mt-0.5" />
                <span>Artisan Hub: Saharanpur & Bengaluru Design Studio, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C88B56] shrink-0" />
                <span>concierge@virsaagifts.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C88B56] shrink-0" />
                <span>+91 98110 00000 / +91 80 4120 0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#233B31] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} VirSaa Gifts Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/catalogue" className="hover:text-stone-400">Catalogue</Link>
            <Link href="/dashboard" className="hover:text-stone-400">My Enquiries</Link>
            <Link href="/admin" className="hover:text-[#E4B58A]">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
