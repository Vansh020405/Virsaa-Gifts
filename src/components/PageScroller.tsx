'use client';

import React from 'react';

export default function PageScroller({ children }: { children: React.ReactNode }) {
  // The page scrolls via the window (normal document flow). The fixed storefront
  // Navbar anchors to the viewport and overlays the top of the content, which is
  // offset below it by each page's own top padding. Admin pages render their own
  // sidebar layout in the same normal flow.
  return (
    <div id="page-scroll" className="min-h-screen">
      {children}
    </div>
  );
}