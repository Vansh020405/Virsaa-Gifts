'use client';

import ProductImage from './ProductImage';
import { Product } from '../lib/supabase/types';
import { Sparkles, Clock, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({
  product,
  onEnquire,
  onSelectProduct,
  compact = false,
}: ProductCardProps) {
  const tierColors: Record<string, string> = {
    Signature: 'bg-[#C88B56]/15 text-[#9E5A38] border-[#C88B56]/30',
    Luxury: 'bg-purple-900/15 text-purple-900 border-purple-300',
    Premium: 'bg-[#1F332B]/15 text-[#1F332B] border-[#1F332B]/20',
    Essential: 'bg-emerald-900/10 text-emerald-800 border-emerald-300',
    Executive: 'bg-stone-900/10 text-stone-800 border-stone-300',
    'Artisan Luxe': 'bg-amber-900/15 text-amber-900 border-amber-300',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking directly on a button or link that has its own handler, don't trigger quick view
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const categoryLabel = (product.category_name || product.subcategory || '')
    .replace(/artisanal gifts/gi, '')
    .trim();

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-3xl border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
      >
        {/* Rounded image with margin */}
        <div className="p-2.5">
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#FAF8F5]">
            <ProductImage
              product={product}
              type="hero"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
          {/* Category + Tier */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#C88B56] truncate font-sans">
              {categoryLabel}
            </span>
            <span
              className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border font-sans ${
                tierColors[product.tier] || 'text-[#1F332B] border-stone-200'
              }`}
            >
              {product.tier}
            </span>
          </div>

          <h3
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct?.(product);
            }}
            className="font-serif-luxury text-base font-semibold text-[#1F332B] leading-snug group-hover:text-[#C88B56] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          <div className="flex items-end justify-between mt-2 gap-2">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-medium font-sans">
                Starting from
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-lg font-semibold text-[#1F332B] tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 font-medium font-sans">
                  + {product.gst_percent}% GST
                </span>
              </div>
            </div>

            {product.speed && (
              <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium font-sans bg-[#FAF8F5] px-2 py-1 rounded-full border border-[#EBE4D8]">
                <Clock className="w-3 h-3 text-[#C88B56]" />
                {product.speed}
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-[#F0EAE1] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct?.(product);
              }}
              className="py-2.5 px-3 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-semibold font-sans text-center flex items-center justify-center gap-1.5 transition-all"
            >
              
              <span>View Details</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEnquire?.(product);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-semibold font-sans text-center flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4B58A]" />
              <span>Enquire</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-3xl border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
    >
      {/* Clean image: rounded, inset margin, no overlays */}
      <div className="p-2.5">
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#FAF8F5]">
          <ProductImage
            product={product}
            type="hero"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
        {/* Category + Tier */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#C88B56] truncate font-sans">
            {categoryLabel}
          </span>
          <span
            className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border font-sans ${
              tierColors[product.tier] || 'text-[#1F332B] border-stone-200'
            }`}
          >
            {product.tier}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct?.(product);
          }}
          className="font-serif-luxury text-base font-semibold text-[#1F332B] leading-snug group-hover:text-[#C88B56] transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Price + Shipment */}
        <div className="flex items-end justify-between mt-2 gap-2">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-medium font-sans">
              Starting from
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-lg font-semibold text-[#1F332B] tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-stone-500 font-medium font-sans">
                + {product.gst_percent}% GST
              </span>
            </div>
          </div>

          {product.speed && (
            <div className="flex items-center gap-1 text-[10px] text-stone-600 font-medium font-sans bg-[#FAF8F5] px-2 py-1 rounded-full border border-[#EBE4D8]">
              <Clock className="w-3 h-3 text-[#C88B56]" />
              {product.speed}
            </div>
          )}
        </div>

        {product.min_order_qty && (
          <p className="text-[10px] text-stone-500 font-medium font-sans mt-1.5">
            Min order: {product.min_order_qty.toLocaleString('en-IN')} pcs
          </p>
        )}

        {/* Actions */}
        <div className="mt-3 pt-3 border-t border-[#F0EAE1] grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct?.(product);
            }}
            className="py-2.5 px-3 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-semibold font-sans text-center flex items-center justify-center gap-1.5 transition-all"
          >
          
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEnquire?.(product);
            }}
            className="py-2.5 px-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-semibold font-sans text-center flex items-center justify-center gap-1.5 transition-all"
          >
           
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </div>
  );
}