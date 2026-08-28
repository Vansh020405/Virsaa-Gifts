'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dbService } from '../../lib/supabase/db-service';
import { Enquiry, Product } from '../../lib/supabase/types';
import { 
  Package, 
  MessageSquareText, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Building2, 
  User, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    pendingReplies: 0,
    estimatedPipelineValue: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, enq, prod] = await Promise.all([
        dbService.getAdminStats(),
        dbService.getEnquiries(),
        dbService.getProducts({ limit: 5 }),
      ]);
      setStats(st);
      setRecentEnquiries(enq.slice(0, 6));
      setProducts(prod.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">New</span>;
      case 'In Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">In Review</span>;
      case 'Replied':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Replied</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700">Closed</span>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Studio Dashboard</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#1F332B]">
            VirSaa Corporate Command Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time tracking of sustainable corporate gifting leads, artisan catalogue & communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-white border border-[#DCD1C4] text-[#1F332B] hover:bg-[#FAF8F5] text-xs font-semibold flex items-center gap-2 shadow-2xs transition"
          >
            <PlusCircle className="w-4 h-4 text-[#C88B56]" />
            <span>Add New Product</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="px-4 py-2.5 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <MessageSquareText className="w-4 h-4 text-[#E4B58A]" />
            <span>Manage Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-[#1F332B]/10 text-[#1F332B] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1F332B]">{stats.totalProducts}</div>
          <p className="text-[11px] text-stone-500 mt-1">Active SKUs across 5 materials</p>
        </div>

        {/* Card 2: Total Enquiries */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-[#C88B56]/15 text-[#9E5A38] flex items-center justify-center">
              <MessageSquareText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1F332B]">{stats.totalEnquiries}</div>
          <p className="text-[11px] text-stone-500 mt-1">Lifetime B2B institutional leads</p>
        </div>

        {/* Card 3: New Enquiries */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">New Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-700">{stats.newEnquiries}</div>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting first response</p>
        </div>

        {/* Card 4: Estimated Pipeline */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pipeline Value</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-800">
            ₹{(stats.estimatedPipelineValue / 100000).toFixed(1)}L
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Estimated order book value</p>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F0EAE1] flex items-center justify-between">
          <div>
            <h2 className="font-serif-luxury font-bold text-lg text-[#1F332B]">
              Recent Corporate Enquiries
            </h2>
            <p className="text-xs text-stone-500">
              Incoming client requests needing customization and quotation review
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-[#C88B56] hover:underline flex items-center gap-1"
          >
            <span>View All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading enquiries...</div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No enquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold border-b border-[#F0EAE1]">
                <tr>
                  <th className="py-3 px-6">Customer & Company</th>
                  <th className="py-3 px-6">Product & SKU</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#FAF8F5] transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1F332B]">{enq.name}</div>
                      <div className="text-stone-500 text-[11px] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#C88B56]" />
                        <span>{enq.company_name || 'Individual / Startup'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-[#1F332B] line-clamp-1 max-w-[200px]">
                        {enq.product_name || 'Bespoke Curation'}
                      </div>
                      <div className="font-mono text-[10px] text-stone-400">{enq.product_sku || 'BESPOKE'}</div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-[#1F332B]">
                      {enq.quantity} pcs
                    </td>

                    <td className="py-4 px-6 text-stone-500">
                      {new Date(enq.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="py-4 px-6">
                      {statusBadge(enq.status)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/enquiries?id=${enq.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#1F332B] hover:bg-[#2D4A3E] text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>Open Thread</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Catalog Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-luxury font-bold text-base text-[#1F332B]">
              Quick Featured Products
            </h3>
            <Link href="/admin/products" className="text-xs font-bold text-[#C88B56] hover:underline">
              Manage Catalog →
            </Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#F0EAE1]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                    <Image
                      src={p.images?.[0]?.storage_path || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80'}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1F332B] truncate max-w-[180px]">{p.name}</p>
                    <p className="text-[10px] text-stone-500 font-mono">{p.sku} • ₹{p.price}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                  {p.tier}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1F332B] to-[#14261F] text-white p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#E4B58A] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Supabase Sync</span>
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
              Real-time Database Active
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every client submission, custom message and product edit is synchronized instantly across the customer catalogue and admin dashboards.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/15 text-xs text-stone-300">
            <span>Status: Operational (Local + Remote Ready)</span>
            <Link href="/catalogue" target="_blank" className="text-[#E4B58A] hover:underline flex items-center gap-1">
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
