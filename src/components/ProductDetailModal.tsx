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
  Check, 
  Share2, 
  ArrowUpRight, 
  Layers, 
  Copy, 
  CheckCheck,
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
  const [prevProductId, setPrevProductId] = useState(product?.id);
  const [prevSku, setPrevSku] = useState(product?.sku);
  if (product?.id !== prevProductId || product?.sku !== prevSku) {
    setPrevProductId(product?.id);
    setPrevSku(product?.sku);
    setActiveImageIndex(0);
    setImgError({});
  }

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
      <div className="relative bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EBE4D8] w-full max-w-5xl max-h-[92vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">

        {/* Close Button: fixed top-right */}
        <button
          onClick={onClose}
          title="Close"
          className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-white border border-[#E4DDD2] shadow-sm text-stone-500 hover:text-stone-900 hover:bg-[#F4EFEA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[92vh]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 md:p-8">

            {/* LEFT: Image Gallery + Actions underneath */}
            <div className="lg:col-span-6 space-y-5">
              {/* Main Image Viewport */}
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl bg-white border border-[#EBE4D8] overflow-hidden flex items-center justify-center group">
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

              {/* Actions: under the image */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  href={`/catalogue/${product.sku}`}
                  onClick={onClose}
                  className="flex-1 px-5 py-3 rounded-xl bg-white border border-[#DCD1C4] text-[#1F332B] hover:bg-white/70 text-sm font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all"
                >
                  <span>Open Dedicated Page</span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>

                <button
                  onClick={() => {
                    onClose();
                    onEnquire?.(product);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#E4B58A]" />
                  <span>Enquire For Custom Quote</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Product Info Directly on Modal Surface */}
            <div className="lg:col-span-6 divide-y divide-[#E4DDD2]">

              {/* Header: SKU / Share */}
              <div className="pb-5 flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#EBE4D8]">
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

                <button
                  onClick={handleCopyLink}
                  title="Share product link"
                  className="p-2 rounded-full hover:bg-white text-stone-500 hover:text-[#1F332B] transition-colors"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Heading + Price */}
              <div className="py-5 space-y-4">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#1F332B] leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-end justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold font-sans block">
                      Starting Corporate Rate
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-semibold text-[#1F332B] tracking-tight font-sans">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-medium text-stone-500 font-sans">
                        + {product.gst_percent}% GST
                      </span>
                    </div>
                  </div>

                  {product.min_order_qty && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block font-sans">
                        Min. Order Qty
                      </span>
                      <span className="text-sm font-bold text-[#1F332B] bg-white px-3 py-1 rounded-lg border border-[#EBE4D8] inline-block mt-0.5 font-sans">
                        {product.min_order_qty} units
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="py-5">
                <h4 className="text-[11px] uppercase font-bold text-stone-400 tracking-wider mb-2 font-sans">
                  Product Overview
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* Material Composition */}
              {product.material_tags && product.material_tags.length > 0 && (
                <div className="py-5">
                  <h4 className="text-[11px] uppercase font-bold text-stone-400 tracking-wider mb-2.5 flex items-center gap-1.5 font-sans">
                    <Leaf className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    <span>Material Composition</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {product.material_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 text-xs font-medium text-stone-700 font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56] flex-shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Block */}
              <div className="py-5">
                <h4 className="text-[11px] uppercase font-bold text-[#1F332B] tracking-wider mb-3 flex items-center gap-1.5 font-sans">
                  <Layers className="w-3.5 h-3.5 text-[#C88B56]" />
                  <span>Product Specifications</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-xs">
                  {product.specification?.dimensions && (
                    <div>
                      <span className="text-stone-400 font-medium block text-[10px] uppercase tracking-wider font-sans">Specification</span>
                      <span className="font-semibold text-stone-800 font-sans">{product.specification.dimensions}</span>
                    </div>
                  )}

                  {product.specification?.packaging && (
                    <div>
                      <span className="text-stone-400 font-medium block text-[10px] uppercase tracking-wider font-sans">Packaging</span>
                      <span className="font-semibold text-stone-800 font-sans">{product.specification.packaging}</span>
                    </div>
                  )}

                  {product.primary_use_case && (
                    <div className="sm:col-span-2">
                      <span className="text-stone-400 font-medium block text-[10px] uppercase tracking-wider font-sans">Ideal For</span>
                      <span className="font-semibold text-[#1F332B] font-sans">{product.primary_use_case}</span>
                    </div>
                  )}
                </div>

                {/* Customization Available */}
                <div className="mt-4 pt-4 border-t border-[#E4DDD2]">
                  <span className="text-xs font-semibold text-[#C88B56] block mb-2 font-sans">
                    ✨ Customization Available:
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56]" />Laser Logo Engraving
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56]" />Custom Packaging
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56]" />Personalized Messages
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary & Secondary Use Cases */}
              {product.secondary_use_cases && product.secondary_use_cases.length > 0 && (
                <div className="py-5">
                  <h4 className="text-[11px] uppercase font-bold text-stone-400 tracking-wider mb-2 font-sans">
                    Recommended Gifting Occasions
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {product.secondary_use_cases.map((uc, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 text-xs font-medium text-stone-700 font-sans"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C88B56] flex-shrink-0" />
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}