'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquareText, 
  Users,
  LogOut
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquareText },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#12211B] text-stone-300 flex flex-col border-r border-[#233B31] min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#233B31]">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/virsaa-logo.png"
            alt="Virsaa Gifts Logo"
            width={1474}
            height={1354}
            className="h-10 w-auto object-contain"
          />
         
        </Link>
      </div>

      {/* Nav Links */}
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-widest font-bold text-stone-500">
          Admin
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

      {/* Logout */}
      <div className="p-4 border-t border-[#233B31]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-white/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
