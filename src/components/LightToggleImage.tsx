'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../lib/supabase/types';
import { Lightbulb } from 'lucide-react';

interface LightToggleImageProps {
  product: Product;
  sizes: string;
  className?: string;
}

interface LightPair {
  on: string;
  off: string;
}

const LIGHT_PRODUCTS: Record<string, LightPair> = {
  'Fnamah(M)': {
    on: '/fnamah-m/light-on.webp',
    off: '/fnamah-m/light-off.webp',
  },
};

export function getLightToggle(product: Product): LightPair | null {
  return LIGHT_PRODUCTS[product.sku] || null;
}

export default function LightToggleImage({
  product,
  sizes,
  className = '',
}: LightToggleImageProps) {
  const light = getLightToggle(product);
  const [lit, setLit] = useState(true);

  if (!light) {
    return null;
  }

  return (
    <>
      <Image
        src={lit ? light.on : light.off}
        alt={product.name}
        fill
        unoptimized
        sizes={sizes}
        className={`${className} transition-opacity duration-300`}
      />
      <button
        type="button"
        aria-label={lit ? 'Light on — click to switch off' : 'Light off — click to switch on'}
        onClick={(e) => {
          e.stopPropagation();
          setLit((v) => !v);
        }}
        className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90"
        style={{
          backgroundColor: lit ? '#C88B56' : '#111827',
          border: lit ? '2px solid rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.35)',
        }}
      >
        <Lightbulb
          className="w-4.5 h-4.5"
          style={{ color: lit ? '#FFF6E8' : '#9CA3AF' }}
        />
      </button>
    </>
  );
}