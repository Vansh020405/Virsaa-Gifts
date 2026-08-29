'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/supabase/db-service';
import { getProductImageUrl } from '../../lib/supabase/storage';
import { Enquiry, EnquiryStatus, Product } from '../../lib/supabase/types';
import { 
  MessageSquareText, 
  Send, 
  ShieldCheck,
  RotateCcw,
  Sparkles, 
  ChevronRight,
  Package
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const loadEnquiries = async () => {
    setLoading(true);
    const data = await dbService.getEnquiries({
      userId: user?.id || null,
      status: filterStatus,
    });
    setEnquiries(data);
    setSelectedEnquiry((prev) => {
      if (!prev) return data[0] ?? null;
      return data.find((e) => e.id === prev.id) ?? prev;
    });
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await dbService.getEnquiries({
        userId: user?.id || null,
        status: filterStatus,
      });
      if (cancelled) return;
      setEnquiries(data);
      setSelectedEnquiry((prev) => {
        if (!prev) return data[0] ?? null;
        return data.find((e) => e.id === prev.id) ?? prev;
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, filterStatus]);

  useEffect(() => {
    dbService.getProducts({ limit: 6 }).then(({ products }) => {
      setSuggestions(products);
    });
  }, []);

  const suggestionProducts = suggestions.filter((p) => p.sku !== selectedEnquiry?.product_sku).slice(0, 4);

  const handleSendCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedEnquiry) return;

    setSendingReply(true);
    try {
      await dbService.addEnquiryMessage(
        selectedEnquiry.id,
        user?.id || 'guest',
        user?.name || selectedEnquiry.name,
        'customer',
        replyMessage.trim()
      );
      setReplyMessage('');
      await loadEnquiries();
    } catch (err) {
      console.error('Failed to send reply', err);
    } finally {
      setSendingReply(false);
    }
  };

  const statusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">New</span>;
      case 'In Review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">In Review</span>;
      case 'Replied':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Replied</span>;
      case 'Closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-700 border border-stone-300">Closed</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <AuthModal />

      {/* Header */}
      <div className="pt-36 pb-12 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-2">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Customer Concierge Portal</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1F332B]">
            My Enquiries & Conversations
          </h1>
          <p className="text-stone-600 text-sm mt-2">
            Direct thread with Virsaa design team for proposals, customizations & delivery updates.
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Status Filters */}
        <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'New', 'In Review', 'Replied', 'Closed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterStatus === st
                    ? 'bg-[#1F332B] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-[#DCD1C4] hover:bg-[#EFE9DE]'
                }`}
              >
                {st === 'all' ? 'All Enquiries' : st}
              </button>
            ))}
          </div>

          <button
            onClick={loadEnquiries}
            className="text-xs text-stone-600 hover:text-[#1F332B] flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-full border border-[#DCD1C4]"
          >
            <RotateCcw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Enquiry List */}
          <div className="lg:col-span-5 space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 h-28 animate-pulse border border-[#E8DFC8]" />
                ))}
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E8DFC8]">
                <MessageSquareText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h3 className="font-serif-luxury font-bold text-base text-[#1F332B]">No Enquiries Found</h3>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  Browse our catalogue to submit a customized corporate gifting enquiry.
                </p>
                <Link
                  href="/catalogue"
                  className="inline-block px-4 py-2 rounded-full bg-[#1F332B] text-white text-xs font-bold"
                >
                  Browse Catalogue
                </Link>
              </div>
            ) : (
              enquiries.map((enq) => {
                const isSelected = selectedEnquiry?.id === enq.id;
                const lastMsg = enq.messages?.[enq.messages.length - 1];

                return (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#C88B56] ring-2 ring-[#C88B56]/30 shadow-md'
                        : 'bg-white/80 hover:bg-white border-[#E8DFC8]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {enq.product_sku || 'BESPOKE'}
                      </span>
                      {statusBadge(enq.status)}
                    </div>

                    <h4 className="text-sm font-bold text-[#1F332B] line-clamp-1">
                      {enq.product_name || 'Bespoke Corporate Curation'}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-stone-500 mt-2 pt-2 border-t border-[#F0EAE1]">
                      <span>{enq.quantity} units</span>
                      <span>{new Date(enq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    {lastMsg && (
                      <p className="text-[11px] text-stone-600 line-clamp-1 italic mt-1.5 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#F0EAE1]">
                        <strong className="text-[#1F332B] not-italic">{lastMsg.sender_type === 'admin' ? 'Virsaa Concierge: ' : 'You: '}</strong>
                        {lastMsg.message}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Active Enquiry Detailed Thread */}
          <div className="lg:col-span-7">
            {selectedEnquiry ? (
              <>
                {/* Product Preview — shown on the page itself */}
                <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden mb-5">
                  <div className="px-5 pt-4 pb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#C88B56] flex items-center gap-1.5 font-sans">
                      <Package className="w-3.5 h-3.5" />
                      <span>Product Preview</span>
                    </span>
                    {statusBadge(selectedEnquiry.status)}
                  </div>

                  <div className="flex gap-5 p-5 pt-2">
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-[#E8DFC8]">
                      <Image
                        src={selectedEnquiry.product_image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col">
                      <span className="font-mono text-[10px] text-stone-400 font-semibold">
                        {selectedEnquiry.id}{selectedEnquiry.product_sku ? ` • ${selectedEnquiry.product_sku}` : ' • BESPOKE'}
                      </span>
                      <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1F332B] line-clamp-2 mt-0.5">
                        {selectedEnquiry.product_name || 'Bespoke Corporate Curation'}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        {selectedEnquiry.quantity} Units • {selectedEnquiry.company_name || selectedEnquiry.name}
                      </p>

                      {selectedEnquiry.customization_requirements && (
                        <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#F4EFEA] border border-[#E8DFC8] text-[11px] text-stone-700 flex items-start gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#C88B56] shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong>Customizations:</strong> {selectedEnquiry.customization_requirements}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto pt-3">
                        {selectedEnquiry.product_sku && (
                          <Link
                            href={`/catalogue/${selectedEnquiry.product_sku}`}
                            className="text-xs font-semibold text-[#C88B56] hover:underline inline-flex items-center gap-1"
                          >
                            View Specs <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Live Chat */}
                <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden flex flex-col h-[460px]">
                  {/* Slim Thread Header */}
                  <div className="px-5 py-3.5 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#C88B56]" />
                      <span className="text-xs font-bold text-[#1F332B] uppercase tracking-wide font-sans">
                        Live Concierge Thread
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 line-clamp-1 max-w-[55%] text-right">
                      {selectedEnquiry.product_name || 'Bespoke enquiry'}
                    </span>
                  </div>

                  {/* Conversation Messages Scroll Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
                    {selectedEnquiry.messages && selectedEnquiry.messages.length > 0 ? (
                      selectedEnquiry.messages.map((msg) => {
                        const isAdmin = msg.sender_type === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-stone-500">
                              {isAdmin ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88B56]" />
                                  <span className="font-bold text-[#1F332B]">{msg.sender_name || 'Virsaa Design Concierge'}</span>
                                </>
                              ) : (
                                <span className="font-semibold text-stone-700">{msg.sender_name || 'You'}</span>
                              )}
                              <span>•</span>
                              <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                                isAdmin
                                  ? 'bg-white border border-[#E2D8CA] text-[#1F332B] rounded-tl-xs shadow-xs'
                                  : 'bg-[#1F332B] text-white rounded-tr-xs shadow-sm'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-xs text-stone-400">
                        No message history yet.
                      </div>
                    )}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendCustomerReply} className="p-3.5 bg-white border-t border-[#E8DFC8]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your message or customization update..."
                        disabled={selectedEnquiry.status === 'Closed'}
                        className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-[#DCD1C4] rounded-xl text-xs sm:text-sm text-[#1F332B] focus:outline-hidden focus:border-[#C88B56] disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={sendingReply || !replyMessage.trim() || selectedEnquiry.status === 'Closed'}
                        className="px-5 py-2.5 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition"
                      >
                        <Send className="w-3.5 h-3.5 text-[#E4B58A]" />
                        <span>Send</span>
                      </button>
                    </div>
                    {selectedEnquiry.status === 'Closed' && (
                      <p className="text-[11px] text-stone-400 mt-1.5 text-center">
                        This enquiry has been closed. Create a new enquiry for future gifting requirements.
                      </p>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center text-stone-400">
                Select an enquiry on the left to view the live conversation.
              </div>
            )}
          </div>
        </div>

        {/* Explore More Gifts — curated suggestions on the page itself */}
        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore More Gifts</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1F332B]">
                Curated for your next gifting moment
              </h2>
            </div>

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1F332B] bg-white border border-[#DCD1C4] hover:bg-[#FAF8F5] px-4 py-2.5 rounded-full transition self-start sm:self-auto"
            >
              View Full Catalogue <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {suggestionProducts.map((p) => (
              <Link
                key={p.id || p.sku}
                href={`/catalogue/${p.sku}`}
                className="group bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden hover:shadow-md transition"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <Image
                    src={getProductImageUrl(p)}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-[#1F332B] line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 uppercase tracking-wide">{p.tier}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-[#1F332B]">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] font-semibold text-[#C88B56] flex items-center gap-0.5">
                      View Gift <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
