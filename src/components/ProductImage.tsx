'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Product, ProductImage as ProductImageType } from '../lib/supabase/types';
import { getProductImageUrl, DEFAULT_PLACEHOLDER } from '../lib/supabase/storage';
import { Leaf } from 'lucide-react';

interface ProductImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  product?: Product | null;
  image?: ProductImageType | string | null;
  type?: 'hero' | 'primary' | 'gallery' | 'packaging' | 'craft';
  alt?: string;
  fallbackSrc?: string;
  className?: string;
}

export default function ProductImage({
  product,
  image,
  type = 'hero',
  alt,
  fallbackSrc = DEFAULT_PLACEHOLDER,
  className = '',
  fill,
  width,
  height,
  sizes,
  priority,
  ...rest
}: ProductImageProps) {
  // Resolve initial URL using Supabase Storage hierarchy
  const initialUrl = React.useMemo(() => {
    if (image) {
      return getProductImageUrl(image, type);
    }
    if (product) {
      return getProductImageUrl(product, type);
    }
    return fallbackSrc;
  }, [product, image, type, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if product or image prop changes
  React.useEffect(() => {
    setCurrentSrc(initialUrl);
    setHasError(false);
    setIsLoading(true);
  }, [initialUrl]);

  const handleError = () => {
    // Fallback hierarchy:
    // 1. Try first gallery image if hero failed
    if (product?.images && product.images.length > 1 && currentSrc !== getProductImageUrl(product.images[1])) {
      setCurrentSrc(getProductImageUrl(product.images[1]));
      return;
    }
    // 2. Try default placeholder
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    // 3. Mark as permanent error for decorative icon fallback
    setHasError(true);
  };

  const computedAlt = alt || product?.name || (typeof image === 'object' && image ? image.storage_path : 'Sustainable Product');

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#F5EFEB] text-stone-400 p-4 ${className}`}>
        <Leaf className="w-8 h-8 text-[#C88B56]/50 mb-1" />
        <span className="text-[10px] font-medium tracking-wider uppercase">Virsaa Atelier</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      <Image
        src={currentSrc}
        alt={computedAlt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        priority={priority}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        className={`${className} ${isLoading ? 'blur-xs scale-98' : 'blur-0 scale-100'} transition-all duration-300`}
        {...rest}
      />
    </div>
  );
}
