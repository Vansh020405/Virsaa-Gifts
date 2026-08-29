'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Compass, 
  ShieldCheck, 
  Award, 
  Check, 
  Layers, 
  Clock, 
  Sliders 
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Navigation */}
      <Navbar />

      {/* Auth Modal & Enquiry Modal */}
      <AuthModal />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedProduct={selectedProductForEnquiry}
      />

      {/* Product Quick-View Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onEnquire={(prod) => handleOpenEnquiry(prod)}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden text-white mt-[73px] py-20">
        {/* Cinematic Video / Ambient Animated Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="/bgVidVirsaa.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle dark/forest-green overlay for readability */}
          <div className="absolute inset-0 bg-[#12211B]/40" />
        </div>

        {/* Floating Brand Elements */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-white">
            Virsaa GIFTS
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-tight hero-text-shadow">
            Gifts That Carry <br />
            <span className="text-gold-gradient font-normal italic">Your Story.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg md:text-lg text-stone-200 leading-relaxed hero-copy-shadow">
            Handcrafted heirloom corporate gifts in reclaimed wood, cork, bamboo and
            preserved moss — personalised with your brand, delivered with meaning.
            Emotion that lingers on every desk, every year.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Link
              href="/catalogue"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C88B56] via-[#D9A45E] to-[#C88B56] text-[#12211B] text-sm font-bold uppercase tracking-wide font-sans border border-[#E4B58A]/70 hover:shadow-md hover:shadow-[#C88B56]/40 hover:brightness-110 active:scale-95 transition-all duration-500 ease-in-out inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* A. BRAND INTRODUCTION */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56]">
                <Leaf className="w-4 h-4" />
                <span>The Virsaa Philosophy</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F332B] leading-tight tracking-tight">
                Beyond Disposable Swag. <br />
                <span className="italic font-normal text-[#C88B56]">Heirloom Corporate Gifts.</span>
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                Modern organizations are shifting away from generic plastic merchandise that ends up in landfills. Virsaa bridges conscious design with timeless emotion.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-[#C88B56] text-white flex items-center justify-center mb-2 font-bold">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B] font-sans">Personalization</h4>
                  <p className="text-xs text-stone-600 mt-1 font-sans">Individual laser engraving, bespoke brass inlays and curated gift cards.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E8DFC8] relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-[#1F332B]/10 text-[#1F332B] flex items-center justify-center mb-2 font-bold">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B] font-sans">Sustainability</h4>
                  <p className="text-xs text-stone-600 mt-1 font-sans">Reclaimed wood, harvested tree-bark cork, bamboo and zero-maintenance moss.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-[#C88B56]/15 text-[#9E5A38] flex items-center justify-center mb-2 font-bold">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B] font-sans">Indian Craftsmanship</h4>
                  <p className="text-xs text-stone-600 mt-1 font-sans">Direct livelihood to traditional craft clusters across Saharanpur, Rajasthan & Nilgiris.</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-[#E8DFC8] relative overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-2 font-bold">
                    4
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B] font-sans">Emotional Connection</h4>
                  <p className="text-xs text-stone-600 mt-1 font-sans">Gifts designed to sit on executive desks for years, continually carrying your story.</p>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                  alt="Virsaa Artisanal Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Overlapping Badge */}
              <div className="absolute -bottom-6 -left-6 bg-[#1F332B] text-white p-5 rounded-2xl shadow-xl max-w-xs border border-[#C88B56]/40 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C88B56] flex items-center justify-center text-white font-bold shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#E4B58A]">Authentic Origin</p>
                    <p className="text-xs text-stone-200 mt-0.5">Handcrafted in certified Indian artisan cooperatives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soft fade: #FAF8F5 -> #F4EFEA */}
      <div className="h-12 bg-gradient-to-b from-[#FAF8F5] to-[#F4EFEA]" />

      {/* ========================================================================= */}
      {/* B. PRODUCT HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Curated Signatures</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1F332B]">
                Selected Sustainable Masterpieces
              </h2>
              <p className="text-stone-600 text-sm mt-1 max-w-xl">
                Explore a preview of our most requested corporate gifting creations, customizable with your brand logo and personal touches.
              </p>
            </div>

            
          </div>

          {/* Product Cards Grid (3-4 desktop, 2-3 tablet, 1-2 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id || product.sku}
                product={product}
                onSelectProduct={(prod) => setSelectedProductForDetail(prod)}
                onEnquire={(prod) => handleOpenEnquiry(prod)}
                compact
              />
            ))}
          </div>

          {/* Explore More CTA */}
          <div className="text-center mt-12">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-bold text-sm shadow-md transition"
            >
              <span>Explore Complete Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* C. MATERIALS SHOWCASE */}
      {/* ========================================================================= */}
      <MaterialsShowcase />

      {/* ========================================================================= */}
      {/* D. CORPORATE GIFTING CTA */}
      {/* ========================================================================= */}
      <section id="contact-cta" className="py-20 bg-[#F8F5F0] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Bespoke Corporate Studio */}
          <div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1F332B] leading-tight mb-4">
              Ready to elevate your corporate gifting experience?
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8 font-sans">
              Connect with our artisan curators to receive custom digital 3D renders and physical prototype hampers.
            </p>

            <div className="flex flex-wrap justify-center gap-3 items-center">
              <Link
                href="/catalogue"
                className="px-7 py-3.5 rounded-full bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all font-sans"
              >
                Browse 2026 Catalogue
              </Link>

              <button
                onClick={() => handleOpenEnquiry()}
                className="px-6 py-3.5 rounded-full border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] font-medium text-sm transition font-sans"
              >
                Talk to Our Team
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
