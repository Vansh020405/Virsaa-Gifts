'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../lib/supabase/types';
import { dbService } from '../lib/supabase/db-service';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle2, Send, Building2, User, Mail, Phone, Layers, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
}

export default function EnquiryModal({ isOpen, onClose, selectedProduct }: EnquiryModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [customizations, setCustomizations] = useState<string[]>(['Logo Engraving']);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdEnquiryId, setCreatedEnquiryId] = useState<string | null>(null);

  // Sync user details when the signed-in user changes
  const [prevUserKey, setPrevUserKey] = useState(user?.id ?? null);
  if ((user?.id ?? null) !== prevUserKey) {
    setPrevUserKey(user?.id ?? null);
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCompanyName(user.company_name || '');
    }
  }

  // Sync quantity when the selected product changes
  const [prevSelectedProductKey, setPrevSelectedProductKey] = useState(selectedProduct?.sku ?? null);
  if ((selectedProduct?.sku ?? null) !== prevSelectedProductKey) {
    setPrevSelectedProductKey(selectedProduct?.sku ?? null);
    if (selectedProduct) {
      setQuantity(selectedProduct.min_order_qty || 25);
    }
  }

  if (!isOpen) return null;

  const toggleCustomization = (option: string) => {
    if (customizations.includes(option)) {
      setCustomizations(customizations.filter((c) => c !== option));
    } else {
      setCustomizations([...customizations, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setIsSubmitting(true);
    try {
      const productImage =
        selectedProduct?.images?.[0]?.storage_path ||
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

      const customReqString = customizations.join(', ');

      const res = await dbService.createEnquiry({
        user_id: user?.id || null,
        product_id: selectedProduct?.id || 'prod-custom',
        product_sku: selectedProduct?.sku || 'BESPOKE-CURATION',
        product_name: selectedProduct?.name || 'Bespoke Custom Gifting Curation',
        product_image: productImage,
        name,
        email,
        phone,
        company_name: companyName,
        quantity: Number(quantity) || 25,
        customization_requirements: customReqString,
        message: message || 'Interested in ordering customized units for corporate gifting.',
      });

      setCreatedEnquiryId(res.id);
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C88B56', '#1F332B', '#E4B58A', '#2D4A3E'],
        });
      } catch {
        // no-op
      }
    } catch (err) {
      console.error('Failed to submit enquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCreatedEnquiryId(null);
    onClose();
  };

  const customizationOptions = [
    'Laser Logo Engraving',
    'Custom Brass Plate Inscription',
    'Plantable Seed Paper Card',
    'Bespoke Box Ribbon & Wax Seal',
    'Custom Material Variant',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-xl border border-[#E8DFC8] overflow-hidden my-8">

        {/* Floating Close */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white border border-[#E4DDD2] shadow-sm text-stone-500 hover:text-stone-900 hover:bg-[#F4EFEA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 pt-10">
            <div className="self-stretch text-left pr-12">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#1F332B]">
                Enquiry Submitted
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Our concierge team will reach out within 4 business hours
              </p>
            </div>

            <div className="text-center flex flex-col items-center pt-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-[#1F332B] mb-2">
              Your enquiry has been received.
            </h3>
            <p className="text-stone-600 max-w-md text-sm mb-6 leading-relaxed">
              Our master artisan and design team will prepare a bespoke quotation and digital mockup preview for{' '}
              <strong className="text-[#1F332B]">{companyName || name}</strong>.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] w-full max-w-md mb-6 text-left text-xs space-y-1.5 shadow-2xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Enquiry ID:</span>
                <span className="font-mono font-bold text-[#1F332B]">{createdEnquiryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Product:</span>
                <span className="font-semibold text-[#1F332B] truncate max-w-[200px]">
                  {selectedProduct?.name || 'Bespoke Curation'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Quantity:</span>
                <span className="font-bold text-[#C88B56]">{quantity} units</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={() => {
                  handleResetAndClose();
                  router.push('/dashboard');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1F332B] text-white font-semibold text-sm hover:bg-[#2D4A3E] transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Track in My Enquiries</span>
                <ArrowRight className="w-4 h-4" />
              </button>
<button
                onClick={handleResetAndClose}
                className="py-3 px-4 rounded-xl border border-[#DCD1C4] text-[#1F332B] hover:bg-white font-medium text-sm transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Title directly on main div */}
            <div className="pt-1 pr-12">
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#1F332B]">
                Request Corporate Gifting Proposal
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Personalized pricing, physical prototyping & bulk timeline
              </p>
            </div>

            {/* Selected Product Banner */}
            {selectedProduct && (
              <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-[#E8DFC8] shadow-2xs">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                  <Image
                    src={selectedProduct.images?.[0]?.storage_path || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {selectedProduct.sku}
                    </span>
                    <span className="text-[11px] text-[#C88B56] font-semibold">
                      ₹{selectedProduct.price} + GST
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1F332B] truncate mt-0.5">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 truncate">
                    Materials: {selectedProduct.material_tags.join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] focus:ring-1 focus:ring-[#C88B56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] focus:ring-1 focus:ring-[#C88B56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] focus:ring-1 focus:ring-[#C88B56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. NovaTech Inc."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] focus:ring-1 focus:ring-[#C88B56]"
                  />
                </div>
              </div>
            </div>

            {/* Quantity Slider / Box */}
            <div className="bg-[#F3EDE4] p-4 rounded-2xl border border-[#E4D7C7]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#1F332B] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C88B56]" />
                  Estimated Order Quantity
                </label>
                <span className="text-sm font-bold text-[#1F332B] bg-white px-3 py-1 rounded-lg border border-[#DCD1C4]">
                  {quantity} units
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#C88B56] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>10 pcs (Min)</span>
                <span>100 pcs</span>
                <span>250 pcs</span>
                <span>500+ pcs (Tier-1 Discount)</span>
              </div>
            </div>

            {/* Customization Options */}
            <div>
              <label className="block text-xs font-semibold text-[#1F332B] mb-2">
                Customization Requirements (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.map((opt) => {
                  const isChecked = customizations.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleCustomization(opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isChecked
                          ? 'bg-[#1F332B] text-white border-[#1F332B] font-semibold'
                          : 'bg-white text-stone-700 border-[#DCD1C4] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message / Details */}
            <div>
              <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                Occasion / Timeline & Specific Requirements
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your event date, delivery cities, logo formatting or custom notes..."
                className="w-full p-3 bg-white border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] focus:ring-1 focus:ring-[#C88B56]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1F332B] to-[#2D4A3E] hover:from-[#172721] hover:to-[#223930] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-99 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#E4B58A]" />
                    <span>Submit Enquiry for Quotation</span>
                  </>
                )}
              </button>
             
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
