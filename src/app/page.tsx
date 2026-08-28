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
  Heart, 
  ShieldCheck, 
  Award, 
  Check, 
  Layers, 
  Clock, 
  Sliders, 
  MessageSquare,
  Building,
  TreeDeciduous,
  Palette
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
      <Navbar onOpenEnquiry={() => handleOpenEnquiry()} />

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
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#12211B] text-white pt-24 pb-20">
        {/* Cinematic Video / Ambient Animated Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-35 scale-105 filter brightness-75"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-carpenter-working-with-wood-42475-large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle warm luxury gradients over video */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12211B] via-[#12211B]/60 to-[#12211B]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,139,86,0.15),transparent_70%)]" />
        </div>

        {/* Floating Brand Elements */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Subtle pill tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#E4B58A] text-xs font-semibold uppercase tracking-widest mb-6 animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5 text-[#E4B58A]" />
            <span>Sustainable & Customizable Corporate Gifting</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
            Gifts That Carry <br />
            <span className="text-gold-gradient font-normal italic">Your Story.</span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-200 font-light leading-relaxed mb-10">
            Personalized, sustainable gifts crafted with purpose for moments that deserve to be remembered.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C88B56] to-[#B3743E] hover:from-[#d59864] hover:to-[#c2814b] text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => handleOpenEnquiry()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/30 hover:border-white/50 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E4B58A]" />
              <span>Send an Enquiry</span>
            </button>
          </div>

          {/* Micro Trust Stats */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300 text-xs">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#E4B58A]">100%</span>
              <span className="text-stone-300">Natural & Zero Plastic</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#E4B58A]">500+</span>
              <span className="text-stone-300">Indian Master Artisans</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#E4B58A]">Bespoke</span>
              <span className="text-stone-300">Precision Laser & Brass</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-[#E4B58A]">3-5 Days</span>
              <span className="text-stone-300">Fast Turnaround Ready</span>
            </div>
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
                <span>The VirSaa Philosophy</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F332B] leading-tight">
                Beyond Disposable Swag. <br />
                <span className="italic font-normal text-[#C88B56]">Heirloom Corporate Gifts.</span>
              </h2>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
                Modern organizations are shifting away from generic plastic merchandise that ends up in landfills. VirSaa bridges conscious design with timeless emotion.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#C88B56]/15 text-[#9E5A38] flex items-center justify-center mb-2 font-bold">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B]">Personalization</h4>
                  <p className="text-xs text-stone-600 mt-1">Individual laser engraving, bespoke brass inlays and curated gift cards.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B]">Sustainability</h4>
                  <p className="text-xs text-stone-600 mt-1">Reclaimed wood, harvested tree-bark cork, bamboo and zero-maintenance moss.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#1F332B]/10 text-[#1F332B] flex items-center justify-center mb-2 font-bold">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B]">Indian Craftsmanship</h4>
                  <p className="text-xs text-stone-600 mt-1">Direct livelihood to traditional craft clusters across Saharanpur, Rajasthan & Nilgiris.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-2 font-bold">
                    4
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B]">Emotional Connection</h4>
                  <p className="text-xs text-stone-600 mt-1">Gifts designed to sit on executive desks for years, continually carrying your story.</p>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
                  alt="VirSaa Artisanal Craftsmanship"
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

      {/* ========================================================================= */}
      {/* B. PRODUCT HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F4EFEA] border-y border-[#E8DFC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Curated Signatures</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#1F332B]">
                Selected Sustainable Masterpieces
              </h2>
              <p className="text-stone-600 text-sm mt-1 max-w-xl">
                Explore a preview of our most requested corporate gifting creations, customizable with your brand logo and personal touches.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1F332B] hover:text-[#C88B56] transition"
            >
              <span>View All Products in Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Product Cards Grid (3-4 desktop, 2-3 tablet, 1-2 mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id || product.sku}
                product={product}
                onSelectProduct={(prod) => setSelectedProductForDetail(prod)}
                onEnquire={(prod) => handleOpenEnquiry(prod)}
              />
            ))}
          </div>

          {/* Explore More CTA */}
          <div className="text-center mt-12">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-bold text-sm shadow-md transition"
            >
              <span>Explore Complete Catalogue (Search & Filters)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* C. WHY VIRSAA - FOUR PILLARS */}
      {/* ========================================================================= */}
      <section id="why-virsaa" className="py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-[#C88B56]">
              Why Choose VirSaa
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F332B] mt-2 mb-4">
              Gifts Designed to Inspire Pride
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Four fundamental pillars that define every gift leaving our studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#C88B56]/15 text-[#9E5A38] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1F332B] mb-2">
                Personalized
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Precision laser branding, bespoke brass engravings, and custom individual recipient names that turn every piece into a singular memory.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TreeDeciduous className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1F332B] mb-2">
                Sustainable
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Crafted strictly with reclaimed timber, renewable cork bark, fast-regenerating bamboo, and zero-maintenance preserved botanical moss.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-[#1F332B]/10 text-[#1F332B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1F332B] mb-2">
                Artisan Crafted
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Celebrating generation-old Indian handcraft traditions, wood lathing, and metal etchings while supporting rural livelihoods.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFC8] shadow-xs hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#1F332B] mb-2">
                Made to Be Remembered
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Heirloom physical objects designed with permanent functional and decorative value that remain on desks for decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* D. MATERIALS SHOWCASE */}
      {/* ========================================================================= */}
      <MaterialsShowcase />

      {/* ========================================================================= */}
      {/* E. CORPORATE GIFTING CTA */}
      {/* ========================================================================= */}
      <section id="contact-cta" className="py-24 bg-[#FAF8F5] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#1F332B] via-[#1A2E26] to-[#12211B] text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-[#C88B56]/30">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88B56]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#E4B58A] mb-3">
                <Building className="w-4 h-4" />
                <span>Enterprise & Leadership Solutions</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
                Make Your Next Gift Meaningful.
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
                Whether you need 25 executive boxes for your board of directors or 1,000 customized sustainable welcome kits for a global summit, our concierge team will bring your vision to life.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => handleOpenEnquiry()}
                  className="px-8 py-4 rounded-full bg-[#C88B56] hover:bg-[#b6763f] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to Us</span>
                </button>

                <Link
                  href="/catalogue"
                  className="px-6 py-4 rounded-full border border-white/30 hover:bg-white/10 text-white font-medium text-sm transition"
                >
                  Browse Catalogue First
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
