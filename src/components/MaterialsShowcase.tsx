'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Leaf } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  ecoFeature: string;
  image: string;
  tactileFeel: string;
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
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact',
    subtitle: 'Sustainability at the core.',
    description: 'Our gifting solutions are created with sustainability in mind, using eco-friendly materials and reusable packaging to reduce unnecessary environmental impact.',
    ecoFeature: 'Eco-friendly materials • Reusable packaging • Sustainable gifting • Reduced environmental footprint',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Eco-friendly and sustainable',
  },
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    subtitle: 'Gifts that carry a story.',
    description: 'Virsaa gifts are designed to create a meaningful connection between the giver and recipient. Each piece brings together craftsmanship, culture and purpose to make gifting more memorable.',
    ecoFeature: 'Meaningful gifting • Cultural craftsmanship • Stories behind every piece • Lasting emotional connection',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Meaningful and memorable',
  },
  {
    id: 'product-highlights',
    name: 'Product Highlights',
    subtitle: 'Thoughtful products, made to last.',
    description: 'Our collection brings together sustainable and customisable gifting solutions, including moss-based corporate gifts that bring a sense of calm and greenery to workspaces.',
    ecoFeature: 'Open customization • Moss-based corporate gifts • 100% eco-friendly • Brings calm & greenery to workspaces • Long-lasting & maintenance-free',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Calm and greenery to workspaces',
  },
  {
    id: 'impact-towards-society',
    name: 'Impact Towards Society',
    subtitle: 'Every step towards change.',
    description: 'Virsaa is committed to creating impact beyond the product. By supporting women artisans and promoting eco-conscious products, we work towards greater financial independence, dignity and lasting empowerment.',
    ecoFeature: 'Fair pay & dignity for women artisans • Promoting eco-friendly products • Financial independence for women • Legacy of empowerment & impact',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    tactileFeel: 'Lasting empowerment and impact',
  },
];

export default function MaterialsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="materials"
      ref={sectionRef}
      className={`transition-colors duration-700 relative overflow-hidden ${
        isActive ? 'bg-[#1F332B]' : 'bg-[#F4EFEA]'
      }`}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C88B56]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#2D4A3E]/40 rounded-full blur-3xl pointer-events-none" />

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-white relative">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
              Rooted in Nature. <br />
              <span className="text-gold-gradient">Elevated by Indian Craftsmanship.</span>
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans mt-3">
              Every material in the Virsaa atelier is handpicked for its tactile dignity, environmental regeneration, and longevity. We replace plastic disposable swag with timeless natural artifacts.
            </p>
          </div>

          {/* Alternating Feature Rows: image <-> info, left/right */}
          <div className="space-y-10 lg:space-y-16">
            {MATERIALS_DATA.map((mat, i) => {
              const imageOnLeft = i % 2 === 0;
              return (
                <div
                  key={mat.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center"
                >
                  {/* Image */}
                  <div
                    className={`relative aspect-4/3 w-full max-w-xs mx-auto lg:max-w-sm lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-white/20 ${
                      imageOnLeft ? 'lg:justify-self-start' : 'lg:justify-self-end lg:order-2'
                    }`}
                  >
                    <Image
                      src={mat.image}
                      alt={mat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[11px] uppercase tracking-widest text-[#E4B58A] font-bold font-sans">
                        Tactile Experience
                      </span>
                      <p className="text-sm font-medium text-white italic mt-0.5 font-sans">
                        &ldquo;{mat.tactileFeel}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className={`space-y-4 ${imageOnLeft ? '' : 'lg:order-1'}`}>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#E4B58A] font-bold font-sans">
                        Material Spotlight
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-white mt-1">
                        {mat.name}
                      </h3>
                      <p className="text-stone-300 text-sm italic mt-1 font-sans">
                        {mat.subtitle}
                      </p>
                    </div>

                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
                      {mat.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                      <div className="flex items-center gap-2 text-[#E4B58A] text-xs font-bold uppercase tracking-wider font-sans">
                        <Leaf className="w-4 h-4" />
                        <span>Sustainability Metric</span>
                      </div>
                      <p className="text-sm text-white font-medium font-sans">
                        {mat.ecoFeature}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}