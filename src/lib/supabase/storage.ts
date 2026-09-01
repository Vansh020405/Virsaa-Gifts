import { supabase } from './client';
import { Product, ProductImage } from './types';

export const SUPABASE_STORAGE_BUCKET = 'product-images';
export const ENQUIRY_ATTACHMENTS_BUCKET = 'enquiry-attachments';
export const SUPABASE_BASE_URL = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uoefljjbzjysuxarkxvj.supabase.co';

export const DEFAULT_PLACEHOLDER = 
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';

/**
 * Constructs a fully qualified public URL for a product image stored in Supabase Storage.
 * Supports storage paths, full URLs, ProductImage objects, and Product objects.
 */
export function getProductImageUrl(
  source?: string | ProductImage | Product | null,
  preferredType: 'hero' | 'primary' | 'gallery' | 'packaging' | 'craft' = 'hero'
): string {
  if (!source) return DEFAULT_PLACEHOLDER;

  // 1. If source is a full Product object
  if (typeof source === 'object' && 'sku' in source) {
    const product = source as Product;
    if (product.images && product.images.length > 0) {
      if (preferredType === 'hero' || preferredType === 'primary') {
        const hero = product.images.find(img => img.image_type === 'primary' || img.storage_path.includes('hero'));
        return getProductImageUrl(hero || product.images[0]);
      }
      const match = product.images.find(img => img.image_type === preferredType);
      return getProductImageUrl(match || product.images[0]);
    }
    return DEFAULT_PLACEHOLDER;
  }

  // 2. If source is a ProductImage record
  let path = '';
  if (typeof source === 'object' && 'storage_path' in source) {
    path = (source as ProductImage).storage_path;
  } else if (typeof source === 'string') {
    path = source;
  }

  if (!path || !path.trim()) return DEFAULT_PLACEHOLDER;

  // 3. If already a full HTTP(S) URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 4. Strip any leading `/products/` or slashes from legacy local paths
  const cleanPath = path
    .replace(/^\/?products\//, '')
    .replace(/^\/+/, '');

  // 5. Return official Supabase Storage public object URL
  return `${SUPABASE_BASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${cleanPath}`;
}

/**
 * Uploads a product image directly to Supabase Storage under `product-images/{SKU}/{filename}`
 * and registers it in the database.
 */
export async function uploadProductImageToStorage(
  sku: string,
  file: File,
  imageType: 'primary' | 'gallery' | 'packaging' | 'craft' = 'gallery',
  sortOrder: number = 1
): Promise<{ storagePath: string; publicUrl: string } | null> {
  if (!supabase) {
    console.warn('Supabase client is not configured.');
    return null;
  }

  try {
    const cleanSku = sku.trim().toLowerCase();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const timestamp = Date.now();
    const filename = imageType === 'primary' && sortOrder === 1 
      ? `hero.${fileExt}` 
      : `image-${timestamp}.${fileExt}`;
    
    const storagePath = `${cleanSku}/${filename}`;

    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/webp'
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    const { data: pubUrlData } = supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: pubUrlData.publicUrl
    };
  } catch (err) {
    console.error('Failed to upload image to Supabase Storage:', err);
    return null;
  }
}

/**
 * Deletes an image from Supabase Storage and database
 */
export async function deleteProductImageFromStorage(storagePath: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const cleanPath = storagePath.replace(/^\/?products\//, '').replace(/^\/+/, '');
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([cleanPath]);

    if (error) {
      console.error('Failed to delete image from storage:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
}

// Downscales an image file and returns a resized JPEG data URL (client-side).
// Keeps payloads small before upload or localStorage persistence.
export async function compressImageFile(
  file: File,
  maxDim = 1280,
  quality = 0.82
): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  try {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    return dataUrl;
  }
}

// Turns a local data URL into a Blob (used before upload to Supabase Storage).
export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(',');
  const mime = meta.match(/^data:(.*?);base64/)?.[1] || 'image/jpeg';
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Uploads an enquiry reference image to Storage under `enquiry-attachments/{ref}/{filename}`
 * and returns its public URL, or null on failure.
 */
export async function uploadEnquiryAttachment(
  dataUrl: string,
  ref: string,
  filename = 'reference'
): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase client is not configured.');
    return null;
  }

  try {
    const cleanRef = ref.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const storagePath = `${cleanRef}/${Date.now()}-${filename.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}.jpg`;

    const { error } = await supabase.storage
      .from(ENQUIRY_ATTACHMENTS_BUCKET)
      .upload(storagePath, dataUrlToBlob(dataUrl), {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg',
      });

    if (error) {
      console.error('Enquiry attachment upload error:', error);
      return null;
    }

    const { data: pubUrlData } = supabase.storage
      .from(ENQUIRY_ATTACHMENTS_BUCKET)
      .getPublicUrl(storagePath);

    return pubUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload enquiry attachment to Storage:', err);
    return null;
  }
}
