'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EnquiryModal from '../../components/EnquiryModal';
import { dbService } from '../../lib/supabase/db-service';
import { getProductImageUrl } from '../../lib/supabase/storage';
import { 
  Leaf, 
  Users, 
  PenTool, 
  Heart, 
  ChevronDown, 
  Sparkles,
  Award,
  Globe2
} from 'lucide-react';

const values = [
  {
    icon: PenTool,
    title: 'Personalized',
    text: 'Laser engraving, brass insignia plaques and plantable seed-paper cards crafted around your brand identity.',
  },
  {
    icon: Leaf,
    title: 'Radically Sustainable',
    text: 'Cork, seed paper, reclaimed timber, bamboo and preserved botanicals engineered to reduce carbon and eliminate plastic.',
  },
  {
    icon: Users,
    title: 'Artisan Co-ops',
    text: 'Direct livelihood and dignified wages across certified craft clusters in Saharanpur, Rajasthan, Nilgiris & Assam.',
  },
  {
    icon: Heart,
    title: 'Heirloom Emotion',
    text: 'Objects sculpted to live proudly on executive desks for years, continually telling your story.',
  },
];

const stats = [
  { value: '1.2L+', label: 'Keepsakes Delivered', sub: 'To leading enterprises pan-India' },
  { value: '25+', label: 'Artisan Workshops', sub: 'Traditional certified craft clusters' },
  { value: '100%', label: 'Plastic-Free Line', sub: 'Biodegradable & circular materials' },
  { value: '4.9/5', label: 'Client Satisfaction', sub: 'Trusted across Fortune 500' },
];

const journey = [
  { 
    year: '2020', 
    title: 'The Seed is Planted', 
    text: 'Virsaa begins in a modest wood atelier with one core premise: corporate gifting should be kinder to our planet.' 
  },
  { 
    year: '2022', 
    title: 'Pan-India Artisan Network', 
    text: 'Established direct trade partnerships with master woodturners, cork harvesters and brass metalworkers.' 
  },
  { 
    year: '2024', 
    title: 'Zero-Plastic Packaging Line', 
    text: 'Introduced 100% plantable seed-paper gift packaging — transforming every box into wildflowers.' 
  },
  { 
    year: '2026', 
    title: 'Next-Gen Conscious Gifting', 
    text: 'Over 1.2 lakh curated hampers delivered to discerning brands, tech innovators, and design-led studios.' 
  },
];

const faqs = [
  {
    q: 'What is the typical minimum order quantity (MOQ)?',
    a: 'Most bespoke collections start at 20–50 units. We offer tiered commercial discounts for corporate campaigns of 100+ units.',
  },
  {
    q: 'How are company logos and branding integrated?',
    a: 'We offer precision laser etching, brushed brass plaques, debossed cork inlays, and plantable seed-paper story cards. A complimentary 3D digital proof is provided prior to production.',
  },
  {
    q: 'What are your standard turnaround times?',
    a: 'Ready-to-ship curations dispatch within 3–5 business days. Custom crafted hampers with bespoke branding typically take 7–14 days with pan-India secure logistics.',
  },
  {
    q: 'What sustainable materials do you specialize in?',
    a: 'We strictly avoid single-use plastics and low-density foam. Our collections utilize sustainably harvested tree bark cork, reclaimed timber, bamboo, natural coir, and zero-maintenance preserved moss.',
  },
  {
    q: 'Do you manage complete hamper packaging and direct dispatch?',
    a: 'Yes. We manage the end-to-end experience: custom kraft presentation boxes, botanical wax seals, individualized note cards, and multi-address door-to-door delivery.',
  },
];

const FALLBACK_COLLAGE = [
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
];

export default function AboutPage() {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [collageImages, setCollageImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { products } = await dbService.getProducts({ limit: 5 });
        if (cancelled) return;
        const real = products
          .filter((p) => p.images && p.images.length > 0)
          .map((p) => getProductImageUrl(p, 'primary'))
          .filter(Boolean);
        setCollageImages(real.length > 0 ? real : FALLBACK_COLLAGE);
      } catch {
        if (!cancelled) setCollageImages(FALLBACK_COLLAGE);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const collage = collageImages.length === 5
    ? collageImages
    : [...collageImages, ...FALLBACK_COLLAGE].slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col selection:bg-[#C88B56]/30 selection:text-[#12211B] relative">
      {/* Floating Pill Navigation */}
      <Navbar />

      {/* Generous top padding so pill navbar never overlaps content */}
      <main className="flex-grow pt-32 sm:pt-40">
        {/* ===================================================================== */}
        {/* 1. HERO SECTION WITH LUXURY FRAMES */}
        {/* ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C88B56]" />
                <span>The Virsaa Story</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1F332B] leading-[1.1]"
              >
                Gifting with Purpose. <br />
                <span className="italic text-gold-gradient font-normal">Crafted to Endure.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-stone-600 text-base sm:text-lg leading-relaxed font-sans max-w-xl"
              >
                We unite thoughtful design, renewable botanicals, and Indian craftsmanship into corporate keepsakes that foster lasting connection.
              </motion.p>

              
            </div>

            {/* Right: Dual Layered Framed Artwork */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Frame 1 */}
              <div className="frame-luxury-gold relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform translate-y-6 animate-float-slow">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                  <Image
                    src="/material/image copy 5.png"
                    alt="Reclaimed Wood Handcrafting"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-[#E4B58A] font-bold">Natural Timber</span>
                    <p className="text-xs font-serif-luxury">Reclaimed & Aged Wood</p>
                  </div>
                </div>
              </div>

              {/* Frame 2 */}
              <div className="frame-gallery relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform -translate-y-4 animate-float-reverse">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C88B56]/30">
                  <Image
                    src="/material/image copy 6.png"
                    alt="Indian Heritage Craftsmanship"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-[#E4B58A] font-bold">Artisan Hands</span>
                    <p className="text-xs font-serif-luxury">Handmade in Rajasthan</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. MANIFESTO & KEY STATS (COMPACT ROUNDED DIV CARD) */}
        {/* ===================================================================== */}
        <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#12211B] border border-[#C88B56]/30 p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
            {/* Ambient subtle glow */}
            <div className="absolute -top-20 left-1/3 w-72 h-72 bg-[#C88B56]/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-[#2D4A3E]/30 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10">
              {/* Minimalist Quote */}
              <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-[#E4B58A] mb-2 font-sans">
                  <Award className="w-3.5 h-3.5" />
                  <span>Our Core Conviction</span>
                </div>
                <h2 className="font-serif-luxury text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-white">
                  &ldquo;A corporate gift is a handshake across distance. It should reflect honour, craftsmanship, and planetary responsibility.&rdquo;
                </h2>
              </div>

              {/* Impact Metric Cards */}
              
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 3. OUR STORY & TIMELINE (WITH RESTORED DUAL IMAGE COMPOSITION) */}
        {/* ===================================================================== */}
        <section className="py-20 sm:py-24 bg-moving-gradient-light relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Framed Dual Picture Composition */}
              <div className="lg:col-span-5 relative pb-8 pr-6">
                {/* Main Large Frame */}
                <div className="frame-luxury-gold relative aspect-[4/3] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                    <Image
                      src="/image.png"
                      alt="Sustainable packaging at Virsaa"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase tracking-widest text-[#E4B58A] font-bold">Atelier Standard</span>
                      <h4 className="text-xs sm:text-sm font-serif-luxury mt-0.5">Direct fair livelihood to 25+ certified workshops.</h4>
                    </div>
                  </div>
                </div>

                {/* Restored Overlapping Corner Image */}
                <div className="absolute -bottom-4 -right-2 sm:-right-4 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FAF8F5] frame-gallery p-1.5 animate-float-slow">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80"
                      alt="Artisan hands at work"
                      fill
                      sizes="180px"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Journey Steps */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56]">
                  <Globe2 className="w-4 h-4" />
                  <span>The Evolution</span>
                </div>

                <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F332B] tracking-tight">
                  From a Wood Atelier to a Movement
                </h2>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
                  We started with a single conviction: corporate milestones deserve gifts made with integrity. Today, we bridge timeless heritage with modern workplace aesthetics.
                </p>

                <div className="space-y-3.5 pt-2">
                  {journey.map((step) => (
                    <div 
                      key={step.year} 
                      className="p-4 sm:p-4.5 rounded-2xl bg-white border border-[#E8DFC8] hover:border-[#C88B56]/50 shadow-2xs hover:shadow-md transition-all flex items-start gap-4"
                    >
                      <div className="px-3 py-1.5 rounded-xl  text-[golden] font-serif-luxury text-sm font-medium shrink-0">
                        {step.year}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1F332B] font-sans">{step.title}</h4>
                        <p className="text-xs text-stone-500 font-sans mt-0.5 leading-relaxed">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 4. WHAT WE VALUE — GUIDING PRINCIPLES (GREEN WRAPPER) */}
        {/* ===================================================================== */}
        <section className="py-16 sm:py-24 bg-moving-gradient-light">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-[#1F332B] border border-[#C88B56]/30 p-6 sm:p-10 lg:p-14 shadow-xl relative overflow-hidden text-white">
              {/* Ambient subtle glow */}
              <div className="absolute -top-24 left-1/3 w-80 h-80 bg-[#C88B56]/15 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-[#2D4A3E]/40 rounded-full blur-[90px] pointer-events-none" />

              <div className="relative z-10">
                <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#E4B58A] mb-2">
                    <Leaf className="w-4 h-4" />
                    <span>Our Guiding Principles</span>
                  </div>
                  <h2 className="text-gold-gradient font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                    Purpose in Every Detail
                  </h2>
                  <p className="text-stone-300 mt-3 text-sm sm:text-base font-sans leading-relaxed">
                    Four commitments guide every bespoke creation we build and ship.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {values.map((v) => {
                    const Icon = v.icon;
                    return (
                      <div
                        key={v.title}
                        className="group p-6 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#C88B56]/50 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#C88B56] to-[#E4B58A] text-[#12211B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-serif-luxury text-xl font-normal text-white mb-2">
                          {v.title}
                        </h3>
                        <p className="text-[13px] text-stone-300 leading-relaxed font-sans">
                          {v.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 5. CRAFT IN MOTION (REDESIGNED 5-PHOTO GALLERY WITH LUXURY FRAMES) */}
        {/* ===================================================================== */}
        <section className="py-24 bg-moving-gradient-light relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#C88B56]" />
                <span>The Craft in Motion</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1F332B]">
                Made Slowly, Given Deliberately
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2 font-sans">
                A gallery showcase of botanical keepsakes, custom hampers, and artisan woodcraft.
              </p>
            </div>

            {/* Redesigned Luxury Framed Collage */}
            <div className="space-y-6 sm:space-y-8">
              {/* Row 1: 3-column framed gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="frame-luxury-gold relative aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                    <Image src={collage[0]} alt="Virsaa Keepsake 1" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#E4B58A]">Botanical Series</span>
                      <p className="text-xs font-serif-luxury">Moss Terrarium Keepsake</p>
                    </div>
                  </div>
                </div>

                <div className="frame-gallery relative aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C88B56]/30">
                    <Image src={collage[1]} alt="Virsaa Keepsake 2" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#E4B58A]">Curated Hamper</span>
                      <p className="text-xs font-serif-luxury">Executive Gift Box Set</p>
                    </div>
                  </div>
                </div>

                <div className="frame-luxury-gold relative aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                    <Image src={collage[2]} alt="Virsaa Keepsake 3" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#E4B58A]">Artisan Heritage</span>
                      <p className="text-xs font-serif-luxury">Brass & Reclaimed Timber</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: 2-column wide framed showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="frame-gallery relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C88B56]/30">
                    <Image src={collage[3]} alt="Virsaa Keepsake 4" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#E4B58A]">Sustainable Packaging</span>
                      <p className="text-sm font-serif-luxury">Zero-Plastic Seed Paper Presentation</p>
                    </div>
                  </div>
                </div>

                <div className="frame-luxury-gold relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
                    <Image src={collage[4]} alt="Virsaa Keepsake 5" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold text-[#E4B58A]">Festive & Corporate Suite</span>
                      <p className="text-sm font-serif-luxury">Preserved Moss & Brass Tabletop Artifacts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. FAQ ACCORDION */}
        {/* ===================================================================== */}
        <section className="bg-moving-gradient-subtle py-24 border-t border-[#E8DFC8]/50 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center opacity-[0.14] pointer-events-none"
            style={{ backgroundImage: "url('/backgrounds/atelier-botanical.png')" }}
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#C88B56] mb-2">
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1F332B]">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const open = openFaq === idx;
                return (
                  <div key={faq.q} className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4.5"
                    >
                      <span className="text-sm font-bold text-[#1F332B] font-sans">{faq.q}</span>
                      <span className={`shrink-0 w-7 h-7 rounded-full bg-[#1F332B]/[0.06] flex items-center justify-center text-[#1F332B] transition-transform duration-300 ${open ? 'rotate-180 bg-[#C88B56] text-white' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    {open && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-[#F0EAE1]">
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 7. CLOSING CALL TO ACTION */}
        {/* ===================================================================== */}
        <section className="bg-[#12211B] py-20 text-white relative overflow-hidden rounded-tl-[2.5rem] rounded-tr-[2.5rem]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="p-8 sm:p-14 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-[#E4B58A]/30 shadow-xl">
              <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal tracking-tight mb-4">
                Let&apos;s Create Gifts Worth Remembering
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-sans">
                Tell us about your recipients, timeline and aesthetic vision. We&apos;ll design custom 3D renders tailored to your brand.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C88B56] to-[#A86F3E] text-white text-xs sm:text-sm font-bold uppercase tracking-wider font-sans border border-[#E4B58A]/40 shadow-sm hover:brightness-105 active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Catalogue</span>
                </Link>
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider font-sans border border-white/25 active:scale-98 transition-all"
                >
                  Talk to Our Team
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}