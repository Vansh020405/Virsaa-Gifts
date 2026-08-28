'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../lib/supabase/types';
import { Sparkles, ArrowUpRight, Clock, Shield, Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.image_type === 'primary')?.storage_path ||
    product.images?.[0]?.storage_path ||
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80';

  const tierColors: Record<string, string> = {
    Signature: 'bg-[#C88B56]/15 text-[#9E5A38] border-[#C88B56]/30',
    Executive: 'bg-[#1F332B]/15 text-[#1F332B] border-[#1F332B]/20',
    'Artisan Luxe': 'bg-purple-900/10 text-purple-900 border-purple-300',
    'Eco Essentials': 'bg-emerald-900/10 text-emerald-800 border-emerald-300',
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#EBE4D8] hover:border-[#C88B56]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image & Badges Container */}
      <div className="relative aspect-4/3 w-full bg-[#F5EFEB] overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md bg-white/90 shadow-2xs ${tierColors[product.tier] || 'text-[#1F332B]'}`}>
            {product.tier}
          </span>
          {product.speed && (
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#1F332B]/90 text-white backdrop-blur-md flex items-center gap-1 shadow-2xs">
              <Clock className="w-2.5 h-2.5 text-[#E4B58A]" />
              {product.speed}
            </span>
          )}
        </div>

        {/* SKU tag */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/60 text-white/90 backdrop-blur-xs">
            {product.sku}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Materials */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium text-[#C88B56] uppercase tracking-wider text-[11px]">
              {product.category_name || product.subcategory}
            </span>
            <div className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-[#2D4A3E]" />
              <span className="text-[11px] text-stone-600 truncate max-w-[120px]">
                {product.material_tags.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/catalogue/${product.sku}`} className="group/title block">
            <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1F332B] line-clamp-2 group-hover/title:text-[#C88B56] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-[#F0EAE1]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-medium">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-[#1F332B] tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  + {product.gst_percent}% GST
                </span>
              </div>
            </div>

            {product.min_order_qty && (
              <span className="text-[10px] font-medium text-stone-500 bg-[#FAF8F5] px-2 py-1 rounded border border-[#EBE4D8]">
                Min: {product.min_order_qty} pcs
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/catalogue/${product.sku}`}
              className="py-2.5 px-3 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-semibold text-center flex items-center justify-center gap-1 transition-all"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>

            <button
              onClick={() => onEnquire?.(product)}
              className="py-2.5 px-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4B58A]" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
