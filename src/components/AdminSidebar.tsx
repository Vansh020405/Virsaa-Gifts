'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquareText, 
  FolderTree, 
  Sparkles, 
  Users, 
  Settings, 
  ArrowLeft, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquareText },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Collections', href: '/admin/collections', icon: Sparkles },
    { name: 'Users / Leads', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#12211B] text-stone-300 flex flex-col border-r border-[#233B31] min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#233B31]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C88B56] to-[#1F332B] flex items-center justify-center text-white shadow-md">
            <span className="font-cinzel text-base font-bold">V</span>
          </div>
          <div>
            <span className="font-cinzel text-lg font-bold text-white tracking-wider">
              Virsaa <span className="text-[#C88B56] text-[10px]">ADMIN</span>
            </span>
            <p className="text-[10px] text-stone-400">Master Management Console</p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-widest font-bold text-stone-500">
          Core Modules
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#C88B56] text-white shadow-md shadow-[#C88B56]/20'
                  : 'hover:bg-white/10 text-stone-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info & Switcher */}
      <div className="p-4 border-t border-[#233B31] space-y-3 bg-[#0E1B16]">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-[#C88B56]/20 border border-[#C88B56]/40 flex items-center justify-center text-[#E4B58A] font-bold text-xs">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-[#E4B58A] truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Master Privileges
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-1.5 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
