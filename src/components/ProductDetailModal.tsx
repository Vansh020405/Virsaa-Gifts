'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductImage } from '../lib/supabase/types';
import { getProductImageUrl } from '../lib/supabase/storage';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Leaf, 
  Clock, 
  Package, 
  Check, 
  Share2, 
  ArrowUpRight, 
  Layers, 
  Copy, 
  CheckCheck,
  ShieldCheck,
  Award,
  Maximize2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire?: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onEnquire,
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedSku, setCopiedSku] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setImgError({});
  }, [product?.id, product?.sku]);

  // Handle keyboard events: Escape to close, Left/Right for images
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && product?.images && product.images.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % product.images!.length);
      } else if (e.key === 'ArrowLeft' && product?.images && product.images.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, product]);

  if (!isOpen || !product) return null;

  const images: ProductImage[] = product.images && product.images.length > 0 
    ? product.images 
    : [
        {
          id: `${product.sku}-fallback`,
          product_id: product.id,
          storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          image_type: 'primary',
          sort_order: 1,
        }
      ];

  const currentImage = images[activeImageIndex] || images[0];

  const tierColors: Record<string, string> = {
    Signature: 'bg-[#C88B56]/15 text-[#9E5A38] border-[#C88B56]/40',
    Luxury: 'bg-purple-900/15 text-purple-900 border-purple-300',
    Premium: 'bg-[#1F332B]/15 text-[#1F332B] border-[#1F332B]/30',
    Essential: 'bg-emerald-900/10 text-emerald-800 border-emerald-300',
    Executive: 'bg-stone-900/10 text-stone-800 border-stone-300',
    'Artisan Luxe': 'bg-amber-900/15 text-amber-900 border-amber-300',
  };

  const handleCopySku = () => {
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/catalogue/${product.sku}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE4D8] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs uppercase font-bold text-[#C88B56] tracking-wider">
              {product.category_name || 'Sustainable Gifting'}
            </span>
            {product.subcategory && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-600 font-medium">{product.subcategory}</span>
              </>
            )}
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EBE4D8]">
              <span className="text-[11px] font-mono font-semibold text-[#1F332B]">
                SKU: {product.sku}
              </span>
              <button
                onClick={handleCopySku}
                title="Copy SKU"
                className="text-stone-400 hover:text-[#1F332B] transition-colors"
              >
                {copiedSku ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Share product link"
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-[#1F332B] transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Image Viewport */}
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl bg-white border border-[#EBE4D8] overflow-hidden shadow-inner flex items-center justify-center group">
                <Image
                  src={
                    imgError[activeImageIndex] 
                      ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
                      : getProductImageUrl(currentImage)
                  }
                  alt={product.name}
                  fill
                  className="object-contain sm:object-cover p-2 sm:p-0 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  onError={() => setImgError((prev) => ({ ...prev, [activeImageIndex]: true }))}
                />

                {/* Badges Over Image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                  <span className={`text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border backdrop-blur-md bg-white/95 shadow-sm ${tierColors[product.tier] || 'text-[#1F332B]'}`}>
                    {product.tier}
                  </span>
                  {product.speed && (
                    <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#1F332B]/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3 h-3 text-[#E4B58A]" />
                      {product.speed}
                    </span>
                  )}
                </div>

                {/* Image Navigation Arrows (if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1F332B] shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1F332B] shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Bottom Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full pointer-events-none">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails Carousel */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-300">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 bg-white ${
                        activeImageIndex === idx
                          ? 'border-[#C88B56] ring-2 ring-[#C88B56]/30 shadow-md scale-95'
                          : 'border-[#EBE4D8] opacity-70 hover:opacity-100 hover:border-stone-400'
                      }`}
                    >
                      <Image
                        src={imgError[idx] ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80' : getProductImageUrl(img)}
                        alt={`Thumb ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Information & Specifications */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F332B] leading-snug">
                  {product.name}
                </h2>

                {/* Price & GST Section */}
                <div className="mt-4 p-4 rounded-2xl bg-white border border-[#EBE4D8] flex items-baseline justify-between shadow-2xs">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Starting Corporate Rate
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#1F332B] tracking-tight">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        + {product.gst_percent}% GST
                      </span>
                    </div>
                  </div>

                  {product.min_order_qty && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                        Min. Order Qty
                      </span>
                      <span className="text-sm font-bold text-[#1F332B] bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#EBE4D8] inline-block mt-0.5">
                        {product.min_order_qty} units
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                  Product Overview
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Material Composition */}
              {product.material_tags && product.material_tags.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Material Composition</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.material_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white border border-[#EBE4D8] text-[#1F332B] shadow-2xs flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Block */}
              <div className="p-4 rounded-2xl bg-white border border-[#EBE4D8] space-y-3 shadow-2xs">
                <h4 className="text-xs uppercase font-bold text-[#1F332B] tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C88B56]" />
                  <span>Product Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {product.specification?.dimensions && (
                    <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4D8]">
                      <span className="text-stone-400 font-medium block text-[10px] uppercase">Specification</span>
                      <span className="font-semibold text-stone-800">{product.specification.dimensions}</span>
                    </div>
                  )}

                  {product.specification?.packaging && (
                    <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4D8]">
                      <span className="text-stone-400 font-medium block text-[10px] uppercase">Packaging</span>
                      <span className="font-semibold text-stone-800">{product.specification.packaging}</span>
                    </div>
                  )}

                  {product.primary_use_case && (
                    <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE4D8] sm:col-span-2">
                      <span className="text-stone-400 font-medium block text-[10px] uppercase">Ideal For</span>
                      <span className="font-semibold text-[#1F332B]">{product.primary_use_case}</span>
                    </div>
                  )}
                </div>

                {/* Customization Available */}
                <div className="pt-2 border-t border-[#F0EAE1]">
                  <span className="text-[11px] font-semibold text-[#C88B56] block mb-1.5">
                    ✨ Customization Available:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                    <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE4D8]">Laser Logo Engraving</span>
                    <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE4D8]">Custom Packaging</span>
                    <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE4D8]">Personalized Messages</span>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary Use Cases */}
              {product.secondary_use_cases && product.secondary_use_cases.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
                    Recommended Gifting Occasions
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.secondary_use_cases.map((uc, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#EBE4D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/catalogue/${product.sku}`}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-bold flex items-center justify-center gap-1.5 transition-all order-2 sm:order-1"
          >
            <span>Open Dedicated Page</span>
            <ArrowUpRight className="w-4 h-4 text-stone-400" />
          </Link>

          <div className="w-full sm:w-auto flex items-center gap-3 order-1 sm:order-2">
            <button
              onClick={() => {
                onClose();
                onEnquire?.(product);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#E4B58A]" />
              <span>Enquire For Custom Quote</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
