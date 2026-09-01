'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, Leaf } from 'lucide-react';
import FooterLogo from '../../Someone is already doing it..png';

export default function Footer() {
  return (
    <footer className="bg-[#12211B] text-stone-300">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand Col */}
          <div className="max-w-xl space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src={FooterLogo}
                alt="Virsaa Gifts Logo"
                width={1474}
                height={1354}
                className="w-20 h-20 object-contain"
              />
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Virsaa Gifts creates premium, personalized and sustainable gifts using wood, MDF, cork, bamboo and preserved moss décor. Combining Indian artisan craftsmanship, personalization, and emotional connection.
            </p>
            <p className="text-xs text-[#E4B58A] italic font-sans">
              “Gifts That Carry Your Story.”
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> 100% Plastic Free
              </span>
              
              
            </div>
          </div>



          {/* Corporate Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
              Concierge Studio
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C88B56] shrink-0 mt-0.5" />
                <span>House no 5160, gmada aerocity, mohali 140306</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C88B56] shrink-0" />
                <span>virsaabyleen@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C88B56] shrink-0" />
                <span>+91 9305534315</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#233B31] mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Virsaa Gifts Private Limited. All rights reserved.</p>
          <p>
            Powered by <span className="text-[#C88B56] font-semibold">Foundrhub</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
