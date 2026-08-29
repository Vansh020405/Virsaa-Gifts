'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EnquiryModal from '../../components/EnquiryModal';
import { dbService } from '../../lib/supabase/db-service';
import { getProductImageUrl } from '../../lib/supabase/storage';
import { Leaf, Users, PenTool, Heart, ChevronDown, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const stats = [
  { value: '100%', label: 'Plastic-free, biodegradable materials' },
  { value: '25+', label: 'Certified artisan clusters across India' },
  { value: '1.2L+', label: 'Corporate gifts delivered' },
  { value: '9 Yrs', label: 'Of sustainable gifting heritage' },
];

const values = [
  {
    icon: Leaf,
    title: 'Radically Sustainable',
    text: 'Cork, seed paper, reclaimed timber, bamboo and preserved botanicals — sourced to keep carbon light and waste lower.',
  },
  {
    icon: Users,
    title: 'Artisan First',
    text: 'Every piece supports skilled craftspeople in certified Indian clusters, keeping traditional techniques alive.',
  },
  {
    icon: PenTool,
    title: 'Boundless Personalization',
    text: 'Laser engraving, brass plaques, bespoke packaging and plantable seed cards — your brand, woven into the gift.',
  },
  {
    icon: Heart,
    title: 'Meaning Beyond the Moment',
    text: 'A gift is a handshake across distance. We design objects that keep telling your story long after the unwrapping.',
  },
];

const journey = [
  { year: '2017', title: 'The Seed is Planted', text: 'Virsaa begins with a single woodshed and a belief that corporate gifts could be kinder to the planet.' },
  { year: '2020', title: 'Artisan Cluster Network', text: 'We build long-term partnerships with 25+ certified workshops across India, from Jaipur brass to coastal cork artisans.' },
  { year: '2023', title: 'Seed Paper & Zero-Plastic Line', text: 'Launch of fully plastic-free, plantable packaging — every gift returns to the earth as wildflowers.' },
  { year: '2026', title: '1.2 Lakh Gifts & Counting', text: 'From boutique studios to Fortune 500 boards, Virsaa now ships purpose-driven gifting pan-India.' },
];

const faqs = [
  {
    q: 'What is the minimum order quantity?',
    a: 'Most products start at 20–50 units. Larger corporate and gifting programs automatically qualify for tiered discounts, with the best rates at 100+ units.',
  },
  {
    q: 'Can I add my company logo or branding?',
    a: 'Yes — we offer laser engraving, brass insignia plaques, screen printing, embroidery and custom ribbon wrapping. A free 3D brand proof is shared for approval before production.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Ready-to-ship items leave within 3–5 working days; custom-made products take 7–14 days. We deliver safely pan-India with sturdy, eco-friendly packaging.',
  },
  {
    q: 'What materials do you avoid?',
    a: 'We avoid single-use plastics, synthetic fillers and low-grade foams. Our collections are built on cork, seed paper, reclaimed wood, bamboo, coir, moss and preserved botanicals.',
  },
  {
    q: 'Do you handle packaging and presentation?',
    a: 'Absolutely. Options include kraft gift boxes, tailored ribbon wrapping, wax seals and plantable seed-paper gift cards — perfect for gifting suites and corporate events.',
  },
  {
    q: 'Can you support bulk gifting for employee or festival programs?',
    a: 'Yes. Our team manages end-to-end gifting programs — curation, branding, packing and door-to-door dispatch — at scale, year-round.',
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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />

      <main className="flex-grow mt-[73px]">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans">
                <span>About Virsaa</span>
              </div>
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F332B] leading-tight">
                Gifting with Purpose. <br /> Crafted to Be Remembered.
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed max-w-lg font-sans">
                Virsaa brings together thoughtful design, sustainable materials, and Indian craftsmanship to create corporate gifts that carry meaning beyond the moment.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-[#E8DFC8] p-4 shadow-2xs">
                    <p className="font-serif-luxury text-2xl font-bold text-[#C88B56] tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-stone-500 leading-snug mt-1 font-sans">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transform translate-y-6">
                <Image
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80"
                  alt="Reclaimed Wood Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transform -translate-y-6">
                <Image
                  src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                  alt="Traditional Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="bg-[#1F332B] text-white py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88B56]/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
              More Than a Gift.
            </h2>
            <div className="space-y-6 text-stone-300 text-lg sm:text-xl leading-relaxed font-sans">
              <p>
                &ldquo;We believe a corporate gift can do more than mark an occasion. It can tell a story, support skilled artisans, celebrate craftsmanship, and make a more thoughtful choice for the environment.
              </p>
              <p>
                From personalised pieces to moss-based gifts and handcrafted products, Virsaa creates gifting experiences that connect people, purpose, and design.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-28 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80"
                    alt="Sustainable packaging at Virsaa"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-4 sm:-right-6 w-40 h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-[#FAF8F5]">
                  <Image
                    src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=80"
                    alt="Artisan hands at work"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans">
                  <span>Our Story</span>
                </div>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#1F332B]">
                  From a Woodshed in India to a Movement in Gifting
                </h2>
                <p className="text-stone-600 leading-relaxed font-sans">
                  Virsaa started with a simple question: why should a thoughtful gift come at the planet&apos;s expense? Nearly a decade later, we partner with certified artisan clusters, work exclusively with renewable and reclaimed materials, and have delivered over 1.2 lakh purpose-driven gifts to corporate clients across the country.
                </p>

                <div className="space-y-0">
                  {journey.map((step) => (
                    <div key={step.year} className="flex gap-4 py-4 border-b border-[#EBE4D8] last:border-0">
                      <span className="font-serif-luxury text-lg font-bold text-[#C88B56] shrink-0 w-14">{step.year}</span>
                      <div>
                        <p className="text-sm font-bold text-[#1F332B] font-sans">{step.title}</p>
                        <p className="text-xs text-stone-500 leading-relaxed mt-1 font-sans">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Value */}
        <section className="bg-[#F4EFEA] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans mb-4">
                <span>What We Value</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#1F332B]">
                Purpose in Every Detail
              </h2>
              <p className="text-stone-600 mt-4 leading-relaxed font-sans">
                Four commitments shape every product we craft and every order we ship.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="bg-white rounded-3xl p-7 border border-[#E8DFC8] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-[#1F332B] text-[#E4B58A] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#1F332B] mb-2">{v.title}</h3>
                    <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-sans">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product Collage */}
        <section className="py-20 lg:py-32 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans mb-4">
                <span>The Craft in Motion</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#1F332B]">
                Made Slowly, Given Deliberately
              </h2>
            </div>

            <div className="flex flex-col gap-8 md:gap-16 lg:gap-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
                <div className="relative w-full md:w-1/3 aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform lg:-rotate-2 hover:rotate-0 transition duration-700 lg:translate-y-6">
                  <Image src={collage[0]} alt="Virsaa Product 1" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/3 aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform lg:rotate-1 hover:rotate-0 transition duration-700 lg:-translate-y-8">
                  <Image src={collage[1]} alt="Virsaa Product 2" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/3 aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform lg:rotate-2 hover:rotate-0 transition duration-700 lg:translate-y-12">
                  <Image src={collage[2]} alt="Virsaa Product 3" fill className="object-cover" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-24 lg:px-32">
                <div className="relative w-full md:w-1/2 aspect-[5/4] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl transform lg:-rotate-1 hover:rotate-0 transition duration-700">
                  <Image src={collage[3]} alt="Virsaa Product 4" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/2 aspect-[5/4] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl transform lg:rotate-1 hover:rotate-0 transition duration-700">
                  <Image src={collage[4]} alt="Virsaa Product 5" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-[#F4EFEA] py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans mb-4">
                <span>FAQ</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#1F332B]">
                Questions, Answered
              </h2>
              <p className="text-stone-600 mt-4 leading-relaxed font-sans">
                Everything teams usually ask before planning their next gifting program.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const open = openFaq === idx;
                return (
                  <div key={faq.q} className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4"
                    >
                      <span className="text-sm font-bold text-[#1F332B] font-sans">{faq.q}</span>
                      <span className={`shrink-0 w-7 h-7 rounded-full bg-[#1F332B]/[0.06] flex items-center justify-center text-[#1F332B] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    {open && (
                      <div className="px-5 sm:px-6 pb-5">
                        <p className="text-sm text-stone-600 leading-relaxed font-sans">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1F332B] text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#C88B56]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#E4B58A] text-xs uppercase tracking-widest font-semibold font-sans mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start a Conversation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Let&apos;s Craft Gifts Worth Remembering
            </h2>
            <p className="text-stone-300 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
              Tell us about your recipients, budget and timeline. We&apos;ll design a sustainable gifting experience around your brand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C88B56] hover:bg-[#b67843] text-white text-sm font-bold shadow-lg transition"
              >
                <span>Start Your Gifting Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/25 hover:bg-white/10 text-white text-sm font-bold transition"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E4B58A]" />
                <span>Explore the Catalogue</span>
              </Link>
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