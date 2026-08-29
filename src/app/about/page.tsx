'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EnquiryModal from '../../components/EnquiryModal';
import { Leaf, Users, PenTool, Heart } from 'lucide-react';

export default function AboutPage() {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />

      <main className="flex-grow mt-[73px]">
        {/* Section 1 & 4: Hero and Visuals */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Intro Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold">
                <span>About Virsaa</span>
              </div>
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F332B] leading-tight">
                Gifting with Purpose. <br /> Crafted to Be Remembered.
              </h1>
              <p className="text-stone-600 text-lg leading-relaxed max-w-lg">
                Virsaa brings together thoughtful design, sustainable materials, and Indian craftsmanship to create corporate gifts that carry meaning beyond the moment.
              </p>
            </div>

            {/* Product Visuals */}
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

        {/* Section 2: What Virsaa is About */}
        <section className="bg-[#1F332B] text-white py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88B56]/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-8">
              More Than a Gift.
            </h2>
            <div className="space-y-6 text-stone-300 text-lg sm:text-xl leading-relaxed font-serif italic">
              <p>
                “We believe a corporate gift can do more than mark an occasion. It can tell a story, support skilled artisans, celebrate craftsmanship, and make a more thoughtful choice for the environment.
              </p>
              <p>
                From personalised pieces to moss-based gifts and handcrafted products, Virsaa creates gifting experiences that connect people, purpose, and design.”
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Product Collage */}
        <section className="py-20 lg:py-32 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 md:gap-16 lg:gap-12">
              {/* Top Row: 3 Images */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="relative w-full md:w-1/3 aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform lg:-rotate-2 hover:rotate-0 transition duration-700 lg:translate-y-6">
                  <Image src="/img%201.webp" alt="Virsaa Product 1" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/3 aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transform lg:rotate-1 hover:rotate-0 transition duration-700 lg:-translate-y-8">
                  <Image src="/img%202.jpeg" alt="Virsaa Product 2" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/3 aspect-[4/5] lg:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl transform lg:rotate-2 hover:rotate-0 transition duration-700 lg:translate-y-12">
                  <Image src="/img%203.webp" alt="Virsaa Product 3" fill className="object-cover" />
                </div>
              </div>

              {/* Bottom Row: 2 Images */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-24 lg:px-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                <div className="relative w-full md:w-1/2 aspect-[5/4] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl transform lg:-rotate-1 hover:rotate-0 transition duration-700">
                  <Image src="/img%204.webp" alt="Virsaa Product 4" fill className="object-cover" />
                </div>
                <div className="relative w-full md:w-1/2 aspect-[5/4] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl transform lg:rotate-1 hover:rotate-0 transition duration-700">
                  <Image src="/img%205.webp" alt="Virsaa Product 5" fill className="object-cover" />
                </div>
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
