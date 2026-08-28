'use client';

import ProductImage from './ProductImage';
import { Product } from '../lib/supabase/types';
import { Sparkles, ArrowUpRight, Clock, Shield, Leaf, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEnquire?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire, onSelectProduct }: ProductCardProps) {
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

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EBE4D8] hover:border-[#C88B56]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden">
        <ProductImage
          product={product}
          type="hero"
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct ? onSelectProduct(product) : null;
            }}
            className="px-4 py-2 rounded-full bg-white/95 hover:bg-white text-[#1F332B] text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 text-[#C88B56]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md bg-white/95 shadow-2xs ${tierColors[product.tier] || 'text-[#1F332B]'}`}>
            {product.tier}
          </span>
          {product.speed && (
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#1F332B]/90 text-white backdrop-blur-md flex items-center gap-1 shadow-2xs">
              <Clock className="w-2.5 h-2.5 text-[#E4B58A]" />
              {product.speed}
            </span>
          )}
        </div>

        {/* SKU tag & Image count */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/65 text-white/95 backdrop-blur-xs">
            {product.sku}
          </span>
          {product.images && product.images.length > 1 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/90 text-stone-800 backdrop-blur-xs shadow-2xs">
              {product.images.length} photos
            </span>
          )}
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
                {product.material_tags?.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct?.(product);
            }}
            className="font-serif-luxury text-base sm:text-lg font-bold text-[#1F332B] line-clamp-2 group-hover:text-[#C88B56] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct ? onSelectProduct(product) : null;
              }}
              className="py-2.5 px-3 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-semibold text-center flex items-center justify-center gap-1 transition-all"
            >
              <span>View Details</span>
              <Eye className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEnquire?.(product);
              }}
              className="py-2.5 px-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs hover:shadow transition-all"
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
