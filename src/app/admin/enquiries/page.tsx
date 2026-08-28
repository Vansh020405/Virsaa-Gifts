'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dbService } from '../../../lib/supabase/db-service';
import { Enquiry, EnquiryStatus } from '../../../lib/supabase/types';
import { useAuth } from '../../../context/AuthContext';
import { 
  MessageSquareText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Send, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  X, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');
  const { user } = useAuth();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [adminNoteText, setAdminNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await dbService.getEnquiries({
        status: statusFilter,
        search: searchQuery,
      });
      setEnquiries(data);

      if (initialId) {
        const found = data.find((e) => e.id === initialId);
        if (found) {
          setSelectedEnquiry(found);
          setAdminNoteText(found.admin_notes || '');
          return;
        }
      }

      if (selectedEnquiry) {
        const refreshed = data.find((e) => e.id === selectedEnquiry.id);
        if (refreshed) {
          setSelectedEnquiry(refreshed);
          setAdminNoteText(refreshed.admin_notes || '');
        }
      } else if (data.length > 0) {
        setSelectedEnquiry(data[0]);
        setAdminNoteText(data[0].admin_notes || '');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, searchQuery]);

  const handleSelectEnquiry = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setAdminNoteText(enq.admin_notes || '');
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedEnquiry) return;

    setSendingReply(true);
    try {
      await dbService.addEnquiryMessage(
        selectedEnquiry.id,
        user?.id || 'admin-1',
        user?.name || 'VirSaa Design Concierge',
        'admin',
        replyText.trim()
      );
      setReplyText('');
      await loadEnquiries();
    } catch (err) {
      console.error('Failed to send admin reply', err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    await dbService.updateEnquiryStatus(selectedEnquiry.id, newStatus);
    await loadEnquiries();
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      await dbService.updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, adminNoteText);
      await loadEnquiries();
    } finally {
      setSavingNotes(false);
    }
  };

  const statusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">New</span>;
      case 'In Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">In Review</span>;
      case 'Replied':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Replied</span>;
      case 'Closed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">Closed</span>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lead & Conversation Manager</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#1F332B]">
            Corporate Enquiry Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Respond to client briefs, configure customizations, adjust status and communicate in real-time.
          </p>
        </div>

        <button
          onClick={loadEnquiries}
          className="px-4 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs font-semibold text-[#1F332B] hover:bg-[#FAF8F5] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['all', 'New', 'In Review', 'Replied', 'Closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#1F332B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-600 border border-[#DCD1C4] hover:bg-[#EFE9DE]'
              }`}
            >
              {st === 'all' ? 'All Enquiries' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, company, SKU..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#DCD1C4] rounded-xl text-xs text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
          />
        </div>
      </div>

      {/* 2-Column Split: Enquiry List + Full Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Enquiry List */}
        <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 h-24 animate-pulse border border-[#E8DFC8]" />
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-xs text-stone-400 border border-[#E8DFC8]">
              No enquiries match the current criteria.
            </div>
          ) : (
            enquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => handleSelectEnquiry(enq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#C88B56] ring-2 ring-[#C88B56]/30 shadow-md'
                      : 'bg-white/80 hover:bg-white border-[#E8DFC8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-stone-500">
                      {enq.id}
                    </span>
                    {statusBadge(enq.status)}
                  </div>

                  <h4 className="text-xs font-bold text-[#1F332B] truncate">{enq.name}</h4>
                  <p className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#C88B56]" />
                    <span>{enq.company_name || 'Individual Lead'}</span>
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 mt-2 pt-2 border-t border-[#F0EAE1]">
                    <span className="font-semibold text-stone-700">{enq.quantity} units</span>
                    <span>{new Date(enq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Conversation & Action View */}
        <div className="lg:col-span-8">
          {selectedEnquiry ? (
            <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden flex flex-col space-y-6 p-6">
              {/* Header: Customer Info & Status Action Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0EAE1] gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1F332B] text-white flex items-center justify-center text-base font-bold shadow-xs">
                    {selectedEnquiry.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-luxury font-bold text-lg text-[#1F332B]">
                        {selectedEnquiry.name}
                      </h3>
                      {statusBadge(selectedEnquiry.status)}
                    </div>
                    <p className="text-xs text-stone-500">
                      {selectedEnquiry.company_name || 'Independent Client'} • Submitted {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Status Switcher Action */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DCD1C4] text-xs font-bold text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* 3-Column Info Cards: Customer, Product, Customizations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Customer Card */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs space-y-2">
                  <h5 className="font-bold text-[#1F332B] uppercase tracking-wider text-[10px] text-[#C88B56]">
                    Customer Contacts
                  </h5>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{selectedEnquiry.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{selectedEnquiry.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{selectedEnquiry.company_name || 'N/A'}</span>
                  </div>
                </div>

                {/* 2. Product Card */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs space-y-2">
                  <h5 className="font-bold text-[#1F332B] uppercase tracking-wider text-[10px] text-[#C88B56]">
                    Product & Volume
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                      <Image
                        src={selectedEnquiry.product_image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1F332B] truncate">{selectedEnquiry.product_name}</p>
                      <p className="font-mono text-[10px] text-stone-500">{selectedEnquiry.product_sku || 'BESPOKE'}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-stone-700 font-medium pt-1">
                    <span>Order Size:</span>
                    <strong className="text-[#C88B56]">{selectedEnquiry.quantity} Units</strong>
                  </div>
                </div>

                {/* 3. Customizations Card */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] text-xs space-y-2">
                  <h5 className="font-bold text-[#1F332B] uppercase tracking-wider text-[10px] text-[#C88B56]">
                    Required Customization
                  </h5>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {selectedEnquiry.customization_requirements || 'Standard packaging / Open to recommendation'}
                  </p>
                </div>
              </div>

              {/* Internal Notes Accordion/Box */}
              <div className="p-4 rounded-2xl bg-[#F4EFEA] border border-[#E4D7C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F332B] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#C88B56]" />
                    Internal Admin Notes (Invisible to Customer)
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-3 py-1 rounded-lg bg-[#1F332B] text-white text-[11px] font-semibold hover:bg-[#2D4A3E] transition disabled:opacity-50"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={adminNoteText}
                  onChange={(e) => setAdminNoteText(e.target.value)}
                  placeholder="Add internal notes about bulk quote discounts, artisan production timelines, or sample dispatch..."
                  className="w-full p-2.5 bg-white border border-[#DCD1C4] rounded-xl text-xs text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
                />
              </div>

              {/* Conversation History Area */}
              <div className="space-y-3">
                <h4 className="font-serif-luxury font-bold text-sm text-[#1F332B] flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-[#C88B56]" />
                  <span>Two-Way Client Conversation Thread</span>
                </h4>

                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8DFC8] p-4 max-h-72 overflow-y-auto space-y-3">
                  {selectedEnquiry.messages && selectedEnquiry.messages.length > 0 ? (
                    selectedEnquiry.messages.map((msg) => {
                      const isAdmin = msg.sender_type === 'admin';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-stone-500">
                            <span className="font-bold text-[#1F332B]">{msg.sender_name || (isAdmin ? 'Admin' : 'Customer')}</span>
                            <span>•</span>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div
                            className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                              isAdmin
                                ? 'bg-[#1F332B] text-white rounded-tr-xs shadow-xs'
                                : 'bg-white border border-[#E2D8CA] text-[#1F332B] rounded-tl-xs shadow-2xs'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-stone-400">
                      No messages yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Reply Composer */}
              <form onSubmit={handleSendAdminReply} className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-[#1F332B]">
                  Send Official VirSaa Concierge Reply
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply (e.g., Thank you for your enquiry. We can customize 120 units with your laser logo...)"
                    className="w-full p-3 bg-white border border-[#DCD1C4] rounded-xl text-xs text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-stone-500">
                    Sending a reply will automatically update enquiry status to <strong className="text-emerald-700">Replied</strong>.
                  </p>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#C88B56] hover:bg-[#b6763f] text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingReply ? 'Sending...' : 'Send Reply to Customer'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8DFC8] p-12 text-center text-stone-400">
              Select an enquiry on the left to view customer parameters and conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
