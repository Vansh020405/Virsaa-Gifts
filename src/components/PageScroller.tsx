'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function PageScroller({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The storefront layout reserves 72px for the fixed Navbar and pulls content
  // up underneath it. Admin pages have no storefront navbar, so that offset
  // would clip their sidebar/headers and leave an empty strip at the top.
  if (pathname?.startsWith('/admin')) {
    return (
      <div id="page-scroll" className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div
      id="page-scroll"
      className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto overflow-x-hidden"
    >
      {/* Negative top margin keeps page content in the same position as when the
          navbar simply overlapped it, while the scrollbar now starts below the navbar. */}
      <div className="-mt-[72px]">{children}</div>
    </div>
  );
}