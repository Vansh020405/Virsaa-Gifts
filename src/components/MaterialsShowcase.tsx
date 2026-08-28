'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Compass, Feather } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  ecoFeature: string;
  image: string;
  tactileFeel: string;
  productsLink: string;
  color: string;
}

const MATERIALS_DATA: MaterialItem[] = [
  {
    id: 'artisan-support',
    name: 'Artisan Support',
    subtitle: 'We support artisan livelihoods.',
    description: 'We directly collaborate with skilled craftsmen and women, ensuring their talents are valued and their work is fairly recognised. Our approach supports dignified livelihoods while helping preserve traditional Indian crafts.',
    ecoFeature: 'Direct collaboration with artisans • Fair pay & dignity • Preserving traditional crafts • Empowering artisan communities',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Preserving traditional Indian crafts',
    productsLink: '/catalogue',
    color: 'from-emerald-950 to-[#1F332B]',
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact',
    subtitle: 'Sustainability at the core.',
    description: 'Our gifting solutions are created with sustainability in mind, using eco-friendly materials and reusable packaging to reduce unnecessary environmental impact.',
    ecoFeature: 'Eco-friendly materials • Reusable packaging • Sustainable gifting • Reduced environmental footprint',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Eco-friendly and sustainable',
    productsLink: '/catalogue',
    color: 'from-[#2A1D15] to-[#452E22]',
  },
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    subtitle: 'Gifts that carry a story.',
    description: 'Virsaa gifts are designed to create a meaningful connection between the giver and recipient. Each piece brings together craftsmanship, culture and purpose to make gifting more memorable.',
    ecoFeature: 'Meaningful gifting • Cultural craftsmanship • Stories behind every piece • Lasting emotional connection',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Meaningful and memorable',
    productsLink: '/catalogue',
    color: 'from-[#4D382A] to-[#8C6246]',
  },
  {
    id: 'product-highlights',
    name: 'Product Highlights',
    subtitle: 'Thoughtful products, made to last.',
    description: 'Our collection brings together sustainable and customisable gifting solutions, including moss-based corporate gifts that bring a sense of calm and greenery to workspaces.',
    ecoFeature: 'Open customization • Moss-based corporate gifts • 100% eco-friendly • Brings calm & greenery to workspaces • Long-lasting & maintenance-free',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Calm and greenery to workspaces',
    productsLink: '/catalogue',
    color: 'from-[#273B28] to-[#486349]',
  },
  {
    id: 'impact-towards-society',
    name: 'Impact Towards Society',
    subtitle: 'Every step towards change.',
    description: 'Virsaa is committed to creating impact beyond the product. By supporting women artisans and promoting eco-conscious products, we work towards greater financial independence, dignity and lasting empowerment.',
    ecoFeature: 'Fair pay & dignity for women artisans • Promoting eco-friendly products • Financial independence for women • Legacy of empowerment & impact',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Lasting empowerment and impact',
    productsLink: '/catalogue',
    color: 'from-[#332A24] to-[#5C4A3E]',
  },
];

export default function MaterialsShowcase() {
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem>(MATERIALS_DATA[0]);

  return (
    <section id="materials" className="py-24 bg-[#1F332B] text-white relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C88B56]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#2D4A3E]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C88B56]/20 border border-[#C88B56]/40 text-[#E4B58A] text-xs uppercase tracking-widest font-semibold mb-4">
            <Leaf className="w-3.5 h-3.5" />
            <span>Honest & Earth-First Materials</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Rooted in Nature. <br />
            <span className="text-gold-gradient">Elevated by Indian Craftsmanship.</span>
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Every material in the Virsaa atelier is handpicked for its tactile dignity, environmental regeneration, and longevity. We replace plastic disposable swag with timeless natural artifacts.
          </p>
        </div>

        {/* Material Selection Tabs / Chips */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {MATERIALS_DATA.map((mat) => {
            const isActive = activeMaterial.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setActiveMaterial(mat)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C88B56] text-white shadow-lg shadow-[#C88B56]/25 scale-105'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                <span>{mat.name.split(' ')[0]}</span>
                {isActive && <Sparkles className="w-3.5 h-3.5 text-amber-200" />}
              </button>
            );
          })}
        </div>

        {/* Featured Material Interactive Showcase Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6 relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src={activeMaterial.image}
                alt={activeMaterial.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] uppercase tracking-widest text-[#E4B58A] font-bold">
                  Tactile Experience
                </span>
                <p className="text-sm font-medium text-white italic mt-0.5">
                  &ldquo;{activeMaterial.tactileFeel}&rdquo;
                </p>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E4B58A] font-bold">
                  Material Spotlight
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
                  {activeMaterial.name}
                </h3>
                <p className="text-stone-300 text-sm italic mt-1 font-serif">
                  {activeMaterial.subtitle}
                </p>
              </div>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {activeMaterial.description}
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#E4B58A] text-xs font-bold uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  <span>Sustainability Metric</span>
                </div>
                <p className="text-sm text-white font-medium">
                  {activeMaterial.ecoFeature}
                </p>
              </div>


            </div>
          </div>
        </div>

        {/* 5-Column Mini Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
          {MATERIALS_DATA.map((mat) => (
            <div
              key={mat.id}
              onClick={() => setActiveMaterial(mat)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeMaterial.id === mat.id
                  ? 'bg-white/15 border-[#C88B56] ring-2 ring-[#C88B56]/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-bold text-white truncate">{mat.name.split(' ')[0]}</p>
              <p className="text-[11px] text-stone-400 truncate mt-0.5">{mat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
