'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AuthModal from '../../components/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../lib/supabase/db-service';
import { Enquiry, EnquiryStatus } from '../../lib/supabase/types';
import { 
  MessageSquareText, 
  Clock, 
  CheckCircle, 
  Send, 
  Layers, 
  Building2, 
  User, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Plus
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<EnquiryStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await dbService.getEnquiries({
        userId: user?.id || null,
        status: filterStatus,
      });
      setEnquiries(data);
      if (selectedEnquiry) {
        const refreshed = data.find((e) => e.id === selectedEnquiry.id);
        if (refreshed) setSelectedEnquiry(refreshed);
      } else if (data.length > 0) {
        setSelectedEnquiry(data[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [user, filterStatus]);

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
      <div className="pt-28 pb-8 bg-gradient-to-b from-[#1F332B] to-[#12211B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E4B58A] font-semibold mb-2">
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Customer Concierge Portal</span>
              </div>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold">
                My Enquiries & Conversations
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Direct thread with VirSaa design team for proposals, customizations & delivery updates.
              </p>
            </div>

            <Link
              href="/catalogue"
              className="px-5 py-2.5 rounded-full bg-[#C88B56] hover:bg-[#b87944] text-white text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Explore More Gifts</span>
            </Link>
          </div>
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
                        <strong className="text-[#1F332B] not-italic">{lastMsg.sender_type === 'admin' ? 'VirSaa Concierge: ' : 'You: '}</strong>
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
              <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-sm overflow-hidden flex flex-col h-[680px]">
                {/* Thread Header */}
                <div className="p-5 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#E8DFC8]">
                      <Image
                        src={selectedEnquiry.product_image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80'}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-stone-500 font-bold">{selectedEnquiry.id}</span>
                        {statusBadge(selectedEnquiry.status)}
                      </div>
                      <h3 className="font-serif-luxury font-bold text-base text-[#1F332B] line-clamp-1">
                        {selectedEnquiry.product_name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {selectedEnquiry.quantity} Units • {selectedEnquiry.company_name || selectedEnquiry.name}
                      </p>
                    </div>
                  </div>

                  {selectedEnquiry.product_sku && (
                    <Link
                      href={`/catalogue/${selectedEnquiry.product_sku}`}
                      className="text-xs font-semibold text-[#C88B56] hover:underline"
                    >
                      View Specs →
                    </Link>
                  )}
                </div>

                {/* Requirements Summary Box */}
                {selectedEnquiry.customization_requirements && (
                  <div className="px-5 py-2.5 bg-[#F4EFEA] border-b border-[#E8DFC8] text-xs text-stone-700 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C88B56] shrink-0" />
                    <span>
                      <strong>Customizations:</strong> {selectedEnquiry.customization_requirements}
                    </span>
                  </div>
                )}

                {/* Conversation Messages Scroll Area */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-stone-50/50">
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
                                <span className="font-bold text-[#1F332B]">{msg.sender_name || 'VirSaa Design Concierge'}</span>
                              </>
                            ) : (
                              <span className="font-semibold text-stone-700">{msg.sender_name || 'You'}</span>
                            )}
                            <span>•</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div
                            className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
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
                <form onSubmit={handleSendCustomerReply} className="p-4 bg-white border-t border-[#E8DFC8]">
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
            ) : (
              <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center text-stone-400">
                Select an enquiry on the left to view the live conversation.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
