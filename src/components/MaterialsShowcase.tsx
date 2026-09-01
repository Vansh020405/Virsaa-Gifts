'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Leaf } from 'lucide-react';

/* =====================================================================
   ▸ HOW TO ADD YOUR OWN IMAGES
   ---------------------------------------------------------------------
   1. Drop your photos into the  public/materials/  folder, e.g.
        public/materials/artisan-support-1.jpg
   2. In the MATERIAL_IMAGES map below, replace each entry with your
      files. You can list several images per spotlight — the first one
      is the main shot, the rest appear as clickable thumbnails:
        'artisan-support': [
          '/materials/artisan-support-1.jpg',
          '/materials/artisan-support-2.jpg',
        ]
   3. You can also use any full https:// URL instead.
   Missing/corrupt files automatically fall back to a stock photo, so
   the section never shows a broken image while you are adding files.
   ===================================================================== */

const MATERIAL_IMAGES: Record<string, string[]> = {
  'artisan-support': [
    '/material/image.png',
  ],
  'environmental-impact': [
    '/material/image copy.png',
  ],
  'emotional-connection': [
    '/material/image copy 2.png',
  ],
  'product-highlights': [
    '/material/image copy 3.png',
  ],
  'impact-towards-society': [
    '/material/image copy 4.png',
  ],
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80';

interface MaterialItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  ecoFeature: string;
  images: string[];
  tactileFeel: string;
}

const MATERIALS_DATA: MaterialItem[] = [
  {
    id: 'artisan-support',
    name: 'Artisan Support',
    subtitle: 'We support artisan livelihoods.',
    description: 'We directly collaborate with skilled craftsmen and women, ensuring their talents are valued and their work is fairly recognised. Our approach supports dignified livelihoods while helping preserve traditional Indian crafts.',
    ecoFeature: 'Direct collaboration with artisans • Fair pay & dignity • Preserving traditional crafts • Empowering artisan communities',
    images: MATERIAL_IMAGES['artisan-support'],
    tactileFeel: 'Preserving traditional Indian crafts',
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact',
    subtitle: 'Sustainability at the core.',
    description: 'Our gifting solutions are created with sustainability in mind, using eco-friendly materials and reusable packaging to reduce unnecessary environmental impact.',
    ecoFeature: 'Eco-friendly materials • Reusable packaging • Sustainable gifting • Reduced environmental footprint',
    images: MATERIAL_IMAGES['environmental-impact'],
    tactileFeel: 'Eco-friendly and sustainable',
  },
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    subtitle: 'Gifts that carry a story.',
    description: 'Virsaa gifts are designed to create a meaningful connection between the giver and recipient. Each piece brings together craftsmanship, culture and purpose to make gifting more memorable.',
    ecoFeature: 'Meaningful gifting • Cultural craftsmanship • Stories behind every piece • Lasting emotional connection',
    images: MATERIAL_IMAGES['emotional-connection'],
    tactileFeel: 'Meaningful and memorable',
  },
  {
    id: 'product-highlights',
    name: 'Product Highlights',
    subtitle: 'Thoughtful products, made to last.',
    description: 'Our collection brings together sustainable and customisable gifting solutions, including moss-based corporate gifts that bring a sense of calm and greenery to workspaces.',
    ecoFeature: 'Open customization • Moss-based corporate gifts • 100% eco-friendly • Brings calm & greenery to workspaces • Long-lasting & maintenance-free',
    images: MATERIAL_IMAGES['product-highlights'],
    tactileFeel: 'Calm and greenery to workspaces',
  },
  {
    id: 'impact-towards-society',
    name: 'Impact Towards Society',
    subtitle: 'Every step towards change.',
    description: 'Virsaa is committed to creating impact beyond the product. By supporting women artisans and promoting eco-conscious products, we work towards greater financial independence, dignity and lasting empowerment.',
    ecoFeature: 'Fair pay & dignity for women artisans • Promoting eco-friendly products • Financial independence for women • Legacy of empowerment & impact',
    images: MATERIAL_IMAGES['impact-towards-society'],
    tactileFeel: 'Lasting empowerment and impact',
  },
];

function MaterialGallery({ images, name, tactileFeel }: { images: string[]; name: string; tactileFeel: string }) {
  const safeImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const safeIndex = Math.min(active, safeImages.length - 1);
  const rawSrc = safeImages[safeIndex];
  const src = failedSrc === rawSrc ? FALLBACK_IMAGE : rawSrc;

  const handleImgError = () => {
    if (rawSrc !== FALLBACK_IMAGE) setFailedSrc(rawSrc);
  };

  const selectImage = (i: number) => {
    setActive(i);
    setFailedSrc(null);
  };

  return (
    <div className="space-y-3">
      {/* Main Image in Luxury Gold Frame */}
      <div className="frame-luxury-gold relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E4B58A]/30">
          <Image
            key={src}
            src={src}
            alt={`${name} — image ${safeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
            onError={handleImgError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12211B]/85 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] uppercase tracking-widest text-[#E4B58A] font-bold font-sans">
              Tactile Essence
            </span>
            <p className="text-sm font-serif-luxury text-white italic mt-0.5">
              &ldquo;{tactileFeel}&rdquo;
            </p>
          </div>

          {/* Image counter badge */}
          {safeImages.length > 1 && (
            <span className="absolute top-3 right-3 text-[10px] font-bold font-sans px-2.5 py-1 rounded-full bg-[#12211B]/80 text-[#E4B58A] backdrop-blur-md border border-[#C88B56]/40 shadow-sm">
              {safeIndex + 1} / {safeImages.length}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {safeImages.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => selectImage(i)}
              aria-label={`View image ${i + 1} for ${name}`}
              className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all active:scale-95 ${
                i === safeIndex
                  ? 'border-[#E4B58A] ring-2 ring-[#C88B56]/40 shadow-md scale-105'
                  : 'border-white/20 hover:border-white/50 opacity-75 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MaterialsShowcase() {
  return (
    <section id="materials" className="py-24 sm:py-32 bg-moving-gradient-light relative overflow-hidden">
      {/* Subtle ambient decorative gradient orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#C88B56]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#2D4A3E]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F332B]/10 border border-[#1F332B]/20 text-[#1F332B] text-xs uppercase tracking-widest font-semibold font-sans mb-3">
            <Leaf className="w-3.5 h-3.5 text-[#C88B56]" />
            <span>Materials & Principles</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-normal tracking-tight text-[#1F332B] leading-tight">
            Rooted in Nature. <br />
            <span className="italic text-gold-gradient font-normal">Elevated by Indian Craftsmanship.</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans mt-3">
            Every material in the Virsaa atelier is handpicked for its tactile dignity, environmental regeneration, and longevity.
          </p>
        </div>

        {/* 5 Distinct Green Rounded Div Cards */}
        <div className="space-y-10 sm:space-y-12">
          {MATERIALS_DATA.map((mat, i) => {
            const imageOnLeft = i % 2 === 0;
            return (
              <div
                key={mat.id}
                className="rounded-3xl bg-[#12211B] border border-[#C88B56]/30 p-6 sm:p-10 shadow-xl hover:shadow-2xl hover:border-[#E4B58A]/50 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Ambient interior card glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#C88B56]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2D4A3E]/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                  {/* Image Gallery Side */}
                  <div
                    className={`lg:col-span-5 w-full ${
                      imageOnLeft ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <MaterialGallery
                      images={mat.images}
                      name={mat.name}
                      tactileFeel={mat.tactileFeel}
                    />
                  </div>

                  {/* Information Side */}
                  <div
                    className={`lg:col-span-7 space-y-4 text-white ${
                      imageOnLeft ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#E4B58A] font-bold">
                        Pillar 0{i + 1}
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-white mt-1">
                        {mat.name}
                      </h3>
                      <p className="text-[#E4B58A]/90 text-xs sm:text-sm italic mt-1 font-sans">
                        {mat.subtitle}
                      </p>
                    </div>

                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
                      {mat.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md space-y-1.5">
                      <div className="flex items-center gap-2 text-[#E4B58A] text-xs font-semibold tracking-wider font-sans">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Sustainability Impact</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 font-medium font-sans">
                        {mat.ecoFeature}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}