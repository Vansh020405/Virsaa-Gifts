'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '../../../lib/supabase/db-service';
import { Category } from '../../../lib/supabase/types';
import { FolderTree } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    dbService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Categories</span>
          </div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-[#1F332B]">Categories</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-[#E8DFC8] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-stone-400 font-bold">{cat.id}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#C88B56] border border-[#E8DFC8]">
                {cat.slug}
              </span>
            </div>
            <h3 className="font-sans font-bold text-lg text-[#1F332B]">{cat.name}</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
