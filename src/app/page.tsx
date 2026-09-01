'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';
import AuthModal from '../components/AuthModal';
import MaterialsShowcase from '../components/MaterialsShowcase';
import ProductDetailModal from '../components/ProductDetailModal';
import { dbService } from '../lib/supabase/db-service';
import { Product } from '../lib/supabase/types';
import { 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  Award, 
  Heart,
  Gift,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      const { products } = await dbService.getProducts({ limit: 6 });
      setFeaturedProducts(products);
    }
    loadData();
  }, []);

  const handleOpenEnquiry = (prod?: Product) => {
    setSelectedProductForEnquiry(prod || null);
    setIsEnquiryOpen(true);
  };

  const pillars = [
    {
      num: '01',
      title: 'Bespoke Inlay',
      desc: 'Precision laser engraving & brass plaques tailored for your brand.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Zero-Waste Craft',
      desc: 'Reclaimed timber, harvested cork bark, and zero-maintenance moss.',
      icon: Leaf,
    },
    {
      num: '03',
      title: 'Artisan Heritage',
      desc: 'Direct livelihood to master craftsmen in Saharanpur, Assam & Rajasthan.',
      icon: Award,
    },
    {
      num: '04',
      title: 'Desk Longevity',
      desc: 'Heirloom objects designed to stay on executive desks for years.',
      icon: Heart,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Select & Customize',
      desc: 'Pick curated keepsakes and share your branding requirements for custom digital 3D renders.',
    },
    {
      step: '02',
      title: 'Handcrafted Sample',
      desc: 'Approve physical prototypes with laser etching, brass plaques, and plantable seed-paper inserts.',
    },
    {
      step: '03',
      title: 'Pan-India Delivery',
      desc: 'Safe, premium plastic-free boxed dispatch straight to client suites and executive teams.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] selection:bg-[#C88B56]/30 selection:text-[#12211B] relative">
      {/* Floating Pill Navigation */}
      <Navbar />

      {/* Modals */}
      <AuthModal />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedProduct={selectedProductForEnquiry}
      />
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onEnquire={(prod) => handleOpenEnquiry(prod)}
      />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION (FULL SCREEN) */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden text-white pt-20 pb-12">
        {/* Background Video with Rich Emerald Forest Vignette covering 100% full screen */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-showcase.mp4" type="video/mp4" />
          </video>
          {/* Stronger overlay so hero text stays clearly readable over the video */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1510]/85 via-[#0B1510]/65 to-[#0B1510]/90" />
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C88B56]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2D4A3E]/30 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          {/* Subtle Tagline Pill */}
          

          {/* Virsaa Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-6 sm:mb-8 drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
          >
            <Image
              src="/logo.png"
              alt="Virsaa Gifts"
              width={1700}
              height={1900}
              priority
              className="h-14 sm:h-20 w-auto object-contain mx-auto"
            />
          </motion.div>

          {/* Minimalist Bold Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-white hero-text-shadow max-w-4xl"
          >
            Gifts That Carry <br />
            <span className="text-gold-gradient italic font-normal">Your Story.</span>
          </motion.h1>

          {/* Minimalist Editorial Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-stone-200/90 leading-relaxed hero-copy-shadow font-sans"
          >
            Handcrafted heirloom keepsakes in reclaimed wood, cork, bamboo and preserved moss. 
            Personalised with your brand, remembered for years.
          </motion.p>

          {/* Action Pills with Clean Classy Hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/catalogue"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#C88B56] via-[#DDAA6D] to-[#C88B56] text-[#12211B] text-xs sm:text-sm font-bold uppercase tracking-wider font-sans border border-[#E4B58A]/50 hover:brightness-105 active:scale-98 transition-all duration-300 inline-flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            
          </motion.div>

          {/* Quick Proof Pillars at Bottom of Hero */}
          
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ATELIER PHILOSOPHY & FRAMED PICTURE SPOTLIGHT */}
      {/* ========================================================================= */}
      <section className="py-24 sm:py-32 bg-moving-gradient-light relative overflow-hidden">
        {/* Subtle decorative radial backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88B56]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56]">
                <Leaf className="w-4 h-4" />
                <span>The Virsaa Atelier</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#1F332B] leading-[1.15] tracking-tight">
                Beyond Disposable Swag. <br />
                <span className="italic text-gold-gradient">Heirloom Artifacts.</span>
              </h2>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-sans">
                Most corporate gifts end up forgotten in desk drawers or landfills. Virsaa replaces ordinary merchandise with thoughtfully sculpted objects that honour tradition, celebrate nature, and carry lasting goodwill.
              </p>

              {/* Minimalist 4 Pillars - 4 squares, 2 in each row on mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3">
                {pillars.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.num}
                      className="p-3.5 sm:p-5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C88B56]/50 shadow-xs hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1F332B] text-[#E4B58A] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-[11px] sm:text-xs font-bold text-[#C88B56]/70 font-serif-luxury">{item.num}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1F332B] font-sans group-hover:text-[#C88B56] transition-colors leading-snug">{item.title}</h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-stone-500 mt-1.5 sm:mt-1 leading-snug sm:leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Luxury Framed Picture Composition */}
            <div className="lg:col-span-6 relative">
              {/* Outer Golden Accents & Gallery Matting Frame */}
              <div className="frame-luxury-gold relative aspect-4/3 rounded-3xl overflow-hidden animate-float-slow">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                  <Image
                    src="/image.png"
                    alt="Master Artisan Crafting Virsaa Keepsakes"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/80 via-transparent to-black/20" />
                  
                  {/* In-Frame Curator Label */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#E4B58A] font-sans">
                        Master Craft Series
                      </span>
                      <h3 className="text-base sm:text-lg font-serif-luxury text-white mt-0.5">
                        Handcrafted in Saharanpur & Rajasthan
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#12211B]/80 backdrop-blur-md border border-[#C88B56]/40 text-[#E4B58A] text-[11px] font-bold">
                      100% Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Framed Mini Accent Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 p-4 rounded-2xl bg-[#1F332B] text-white border border-[#C88B56]/40 shadow-xl max-w-[260px] animate-float-reverse hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C88B56] to-[#E4B58A] text-[#12211B] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#E4B58A] uppercase tracking-wider">Heritage Standard</div>
                    <div className="text-[11px] text-stone-300 mt-0.5">Direct fair livelihood to 25+ certified workshops.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CURATED SIGNATURES / 6 REDUCED-SIZE CATALOGUE CARDS */}
      {/* ========================================================================= */}
      <section className="py-24 bg-moving-gradient-subtle relative border-t border-[#E8DFC8]/50 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-[0.14] pointer-events-none"
          style={{ backgroundImage: "url('/backgrounds/atelier-botanical.png')" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Curated Signatures</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F332B]">
                Selected Sustainable Masterpieces
              </h2>
              <p className="text-stone-600 text-sm mt-1.5 max-w-xl font-sans">
                Each piece is customizable with laser insignia, brass inlays and personalized eco-packaging.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F332B] hover:text-[#C88B56] transition-colors pb-1 border-b border-[#1F332B] hover:border-[#C88B56] w-fit font-sans"
            >
              <span>View Full 2026 Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Cards Grid: 2 in a row on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {featuredProducts.slice(0, 6).map((product) => (
              <div 
                key={product.id || product.sku}
                className="frame-gallery group"
              >
                <ProductCard
                  product={product}
                  onSelectProduct={(prod) => setSelectedProductForDetail(prod)}
                  onEnquire={(prod) => handleOpenEnquiry(prod)}
                  compact
                />
              </div>
            ))}
          </div>

          {/* Bottom Explore Button */}
          <div className="text-center mt-12">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all font-sans border border-[#C88B56]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4B58A]" />
              <span>Explore Complete 2026 Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MATERIALS SHOWCASE */}
      {/* ========================================================================= */}
      <MaterialsShowcase />

      {/* ========================================================================= */}
      {/* 5. SEAMLESS CORPORATE PROCESS */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#FAF8F5] relative border-t border-[#E8DFC8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56] mb-3">
              <Compass className="w-4 h-4" />
              <span>Effortless Execution</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F332B]">
              How Gifting with Virsaa Works
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3 font-sans">
              From initial curation to executive unboxing in 3 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((item, idx) => (
              <div 
                key={item.step}
                className="relative p-8 rounded-3xl bg-white border border-[#E8DFC8] shadow-xs hover:shadow-xl hover:border-[#C88B56]/50 transition-all duration-300 flex flex-col group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#1F332B] text-[#E4B58A] flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                    {item.step}
                  </div>
                  <span className="text-xs font-bold text-[#C88B56] uppercase tracking-wider font-sans">
                    Step {idx + 1}
                  </span>
                </div>

                <h3 className="font-serif-luxury text-xl font-medium text-[#1F332B] mb-2 group-hover:text-[#C88B56] transition-colors">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EXECUTIVE CORPORATE CTA */}
      {/* ========================================================================= */}
      <section id="contact-cta" className="py-20 sm:py-28 bg-[#12211B] relative overflow-hidden rounded-tl-[2.5rem] rounded-tr-[2.5rem]">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C88B56]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#2D4A3E]/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-8 sm:p-14 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-[#E4B58A]/25 shadow-2xl relative">
            
           

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-white leading-tight mb-4">
              Ready to elevate your corporate gifting experience?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto font-sans">
              Connect directly with our artisan curators to receive custom 3D design renders and physical prototype hampers.
            </p>

            <div className="flex flex-wrap justify-center gap-4 items-center">
              <Link
                href="/catalogue"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C88B56] to-[#A86F3E] hover:brightness-105 active:scale-98 text-white font-bold text-xs sm:text-sm uppercase tracking-wider font-sans transition-all border border-[#E4B58A]/40"
              >
                Browse 2026 Catalogue
              </Link>

              <button
                onClick={() => handleOpenEnquiry()}
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider font-sans border border-white/25 active:scale-98 transition-all backdrop-blur-md"
              >
                Talk to Our Curator
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
