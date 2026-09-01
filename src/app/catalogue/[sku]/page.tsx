'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import ProductDetailModal from '../../../components/ProductDetailModal';
import EnquiryModal from '../../../components/EnquiryModal';
import AuthModal from '../../../components/AuthModal';
import { dbService } from '../../../lib/supabase/db-service';
import { Product } from '../../../lib/supabase/types';
import { getProductImageUrl } from '../../../lib/supabase/storage';
import { 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  Compass, 
  Share2
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const sku = params?.sku as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Enquiry Modal
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!sku) return;
      setLoading(true);
      try {
        const prod = await dbService.getProductBySku(sku);
        setProduct(prod);

        if (prod) {
          const { products } = await dbService.getProducts({ limit: 4 });
          setRelatedProducts(products.filter((p) => p.id !== prod.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [sku]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
            <div className="lg:col-span-7 bg-stone-200 aspect-4/3 rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-stone-200 rounded-lg w-3/4" />
              <div className="h-4 bg-stone-200 rounded-lg w-1/2" />
              <div className="h-24 bg-stone-200 rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[#1F332B] mb-2">Product Not Found</h2>
          <p className="text-stone-600 text-sm mb-6">The requested SKU {sku} could not be located in our catalogue.</p>
          <Link
            href="/catalogue"
            className="px-6 py-3 rounded-full bg-[#1F332B] text-white text-xs font-bold"
          >
            Return to Catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: '1', product_id: product.id, storage_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80', image_type: 'primary' as const, sort_order: 1 }];

  const activeImage = images[selectedImageIndex] || images[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <AuthModal />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedProduct={product}
      />
      <ProductDetailModal
        product={selectedModalProduct}
        isOpen={!!selectedModalProduct}
        onClose={() => setSelectedModalProduct(null)}
        onEnquire={(p) => {
          setProduct(p);
          setIsEnquiryOpen(true);
        }}
      />

      {/* Breadcrumb Bar */}
      <div className="pt-24 pb-4 border-b border-[#E8DFC8] bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Link href="/catalogue" className="hover:text-[#1F332B] flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </Link>
            <span>/</span>
            <span className="text-stone-600 truncate max-w-[200px]">{product.category_name || product.subcategory}</span>
            <span>/</span>
            <span className="text-[#1F332B] font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#DCD1C4] text-stone-700 hover:text-[#1F332B] text-[11px] font-medium transition"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? 'Copied link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ========================================================================= */}
          {/* LEFT: IMAGE GALLERY */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Big Active Image */}
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-[#F4EFEA] border border-[#E8DFC8] shadow-lg">
              <Image
                src={getProductImageUrl(activeImage)}
                alt={product.name}
                fill
                priority
                className="object-contain transition-all duration-300 p-2"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1F332B] shadow-xs border border-white/40">
                  {product.tier}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1F332B]/90 backdrop-blur-md text-white shadow-xs flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#E4B58A]" />
                  {product.speed}
                </span>
              </div>
            </div>

            {/* Thumbnails (Gracefully hidden if only 1 image) */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#C88B56] ring-2 ring-[#C88B56]/40 scale-105'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getProductImageUrl(img)}
                      alt={`${product.name} preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Eco Impact & Origin Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  <Leaf className="w-4 h-4" />
                  <span>Sustainability Impact</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {product.specification?.eco_impact || '100% natural, plastic-free and biodegradable packaging.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9E5A38] uppercase tracking-wider mb-1">
                  <Compass className="w-4 h-4" />
                  <span>Artisan Origin</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {product.specification?.origin || 'Handcrafted in certified Indian artisan clusters.'}
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: DETAILS & ACTIONS */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-bold text-[#C88B56] uppercase tracking-widest">
                  {product.category_name || product.subcategory}
                </span>
                <span className="font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1F332B] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-[11px] uppercase font-bold text-stone-400">Institutional B2B Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-3xl font-bold tracking-tight text-[#1F332B]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      + {product.gst_percent}% GST
                    </span>
                  </div>
                </div>

                {product.min_order_qty && (
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Min. Order</span>
                    <span className="text-xs font-bold text-[#1F332B] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8DFC8]">
                      {product.min_order_qty} units
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-2 border-t border-[#F0EAE1] pt-2">
                * Bulk tiered pricing discounts (10% - 25%) automatically applied for orders of 100+ units.
              </p>
            </div>

            {/* Short Narrative */}
            <p className="text-stone-700 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Primary Action Button */}
            <div className="space-y-3">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1F332B] to-[#2D4A3E] hover:from-[#172721] hover:to-[#223930] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-99 transition-all flex items-center justify-center gap-2.5"
              >
                <Sparkles className="w-5 h-5 text-[#E4B58A]" />
                <span>Send Enquiry / Request Quotation</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free 3D Brand Proof
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88B56]" /> Pan-India Doorstep Delivery
                </span>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8DFC8]">
              <h4 className="font-sans text-base font-bold tracking-tight text-[#1F332B]">
                Specifications &amp; Materials
              </h4>

              {product.material_tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-2.5">
                    Materials
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.material_tags.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] text-[11px] font-semibold text-[#1F332B]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(() => {
                const specRows = [
                  { label: 'Dimensions', value: product.specification?.dimensions },
                  { label: 'Approx. Weight', value: product.specification?.weight },
                  { label: 'Surface Finish', value: product.specification?.finish },
                  { label: 'Standard Packaging', value: product.specification?.packaging },
                ].filter((r) => r.value) as { label: string; value: string }[];

                return (
                  <div className="mt-4 divide-y divide-[#F0EAE1] border-t border-[#F0EAE1]">
                    {specRows.map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-4 py-3 text-[13px]">
                        <span className="text-stone-500 shrink-0">{row.label}</span>
                        <span className="font-semibold text-[#1F332B] text-right break-words min-w-0 flex-1">
                          {row.value}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-start justify-between gap-4 py-3 text-[13px]">
                      <span className="text-stone-500 shrink-0">Best For</span>
                      <span className="font-semibold text-[#1F332B] text-right break-words min-w-0 flex-1">
                        {product.primary_use_case}
                      </span>
                    </div>
                    {product.secondary_use_cases.length > 0 && (
                      <div className="flex items-start justify-between gap-4 py-3 text-[13px]">
                        <span className="text-stone-500 shrink-0">Also Great For</span>
                        <span className="font-semibold text-[#1F332B] text-right break-words min-w-0 flex-1">
                          {product.secondary_use_cases.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#E8DFC8]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#C88B56]">Artisan Pairings</span>
                <h3 className="font-sans text-2xl font-bold tracking-tight text-[#1F332B]">You May Also Consider</h3>
              </div>
              <Link href="/catalogue" className="text-xs font-bold text-[#1F332B] hover:text-[#C88B56]">
                View Full Catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id || p.sku}
                  product={p}
                  onSelectProduct={(prod) => setSelectedModalProduct(prod)}
                  onEnquire={(prod) => {
                    setProduct(prod);
                    setIsEnquiryOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
