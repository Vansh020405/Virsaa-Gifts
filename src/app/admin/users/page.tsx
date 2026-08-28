'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '../../../lib/supabase/db-service';
import { Enquiry } from '../../../lib/supabase/types';
import { Users, Mail, Phone, Building2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminUsersPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    dbService.getEnquiries().then(setEnquiries);
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Corporate Directory</span>
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold text-[#1F332B]">Registered Clients & B2B Leads</h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold border-b border-[#F0EAE1]">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Company</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Associated Enquiries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-4 px-6 font-bold text-[#1F332B]">{e.name}</td>
                  <td className="py-4 px-6 text-stone-700">{e.company_name || 'Individual'}</td>
                  <td className="py-4 px-6 text-stone-600 font-mono">{e.email}</td>
                  <td className="py-4 px-6 text-stone-600">{e.phone}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {e.id} ({e.quantity} pcs)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
