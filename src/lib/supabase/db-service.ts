import { supabase, isSupabaseConfigured } from './client';
import { Product, Category, Collection, Enquiry, EnquiryMessage, EnquiryStatus } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS, INITIAL_ENQUIRIES } from './mock-data';

const STORAGE_KEYS = {
  PRODUCTS: 'virsaa_products_v1',
  CATEGORIES: 'virsaa_categories_v1',
  COLLECTIONS: 'virsaa_collections_v1',
  ENQUIRIES: 'virsaa_enquiries_v1',
  NOTIFICATIONS: 'virsaa_notifications_v1',
};

// Helper for Local Storage access in browser
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing to local storage', err);
  }
}

export const dbService = {
  // PRODUCTS
  async getProducts(params?: {
    categorySlug?: string;
    material?: string;
    tier?: string;
    speed?: string;
    collection?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest';
    limit?: number;
    offset?: number;
  }): Promise<{ products: Product[]; total: number }> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').select('*, images:product_images(*)', { count: 'exact' });
        if (params?.search) {
          query = query.ilike('name', `%${params.search}%`);
        }
        if (params?.tier && params.tier !== 'all') {
          query = query.eq('tier', params.tier);
        }
        if (params?.speed && params.speed !== 'all') {
          query = query.eq('speed', params.speed);
        }
        if (params?.minPrice) {
          query = query.gte('price', params.minPrice);
        }
        if (params?.maxPrice) {
          query = query.lte('price', params.maxPrice);
        }
        if (params?.sortBy === 'price_asc') {
          query = query.order('price', { ascending: true });
        } else if (params?.sortBy === 'price_desc') {
          query = query.order('price', { ascending: false });
        } else if (params?.sortBy === 'name_asc') {
          query = query.order('name', { ascending: true });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, count, error } = await query;
        if (!error && data && data.length > 0) {
          return { products: data as Product[], total: count || data.length };
        }
      } catch (e) {
        console.warn('Supabase fetch failed, using local DB:', e);
      }
    }

    // Fallback / Local Storage
    let list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.material_tags.some((m) => m.toLowerCase().includes(q))
      );
    }
    if (params?.categorySlug && params.categorySlug !== 'all') {
      const cat = INITIAL_CATEGORIES.find((c) => c.slug === params.categorySlug);
      if (cat) {
        list = list.filter((p) => p.category_id === cat.id || p.category_name?.toLowerCase() === cat.name.toLowerCase());
      }
    }
    if (params?.material && params.material !== 'all') {
      list = list.filter((p) => p.material_tags.includes(params.material!));
    }
    if (params?.tier && params.tier !== 'all') {
      list = list.filter((p) => p.tier === params.tier);
    }
    if (params?.speed && params.speed !== 'all') {
      list = list.filter((p) => p.speed === params.speed);
    }
    if (params?.collection && params.collection !== 'all') {
      list = list.filter((p) => p.collections?.some((c) => c.toLowerCase().includes(params.collection!.toLowerCase())));
    }
    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    }

    const total = list.length;
    if (params?.offset !== undefined || params?.limit !== undefined) {
      const start = params.offset || 0;
      const end = params.limit ? start + params.limit : undefined;
      list = list.slice(start, end);
    }

    return { products: list, total };
  },

  async getProductBySku(sku: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, images:product_images(*)')
          .eq('sku', sku)
          .single();
        if (!error && data) return data as Product;
      } catch (err) {
        console.warn('Supabase product sku lookup failed:', err);
      }
    }
    const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return list.find((p) => p.sku.toLowerCase() === sku.toLowerCase()) || null;
  },

  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error && data && data.length > 0) return data as Category[];
      } catch (err) {
        console.warn('Supabase getCategories failed:', err);
      }
    }
    return getLocalItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async getCollections(): Promise<Collection[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('collections').select('*');
        if (!error && data && data.length > 0) return data as Collection[];
      } catch (err) {
        console.warn('Supabase getCollections failed:', err);
      }
    }
    return getLocalItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
  },

  // ENQUIRIES
  async createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      status: 'New',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          enquiry_id: 'enq-' + Date.now(),
          sender_id: enquiry.user_id || 'guest',
          sender_name: enquiry.name,
          sender_type: 'customer',
          message: enquiry.message + (enquiry.customization_requirements ? `\n\nCustomization: ${enquiry.customization_requirements}` : ''),
          created_at: new Date().toISOString(),
        },
      ],
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('enquiries').insert([newEnquiry]).select().single();
        if (!error && data) return data as Enquiry;
      } catch (err) {
        console.warn('Supabase insert enquiry failed, stored in local:', err);
      }
    }

    const current = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const updated = [newEnquiry, ...current];
    setLocalItem(STORAGE_KEYS.ENQUIRIES, updated);
    return newEnquiry;
  },

  async getEnquiries(params?: { status?: EnquiryStatus | 'all'; userId?: string | null; search?: string }): Promise<Enquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('enquiries').select('*, messages:enquiry_messages(*)').order('created_at', { ascending: false });
        if (params?.userId) query = query.eq('user_id', params.userId);
        if (params?.status && params.status !== 'all') query = query.eq('status', params.status);
        const { data, error } = await query;
        if (!error && data) return data as Enquiry[];
      } catch (err) {
        console.warn('Supabase getEnquiries failed:', err);
      }
    }

    let list = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    if (params?.userId) {
      list = list.filter((e) => e.user_id === params.userId || e.email.toLowerCase() === (params.userId || '').toLowerCase());
    }
    if (params?.status && params.status !== 'all') {
      list = list.filter((e) => e.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.company_name?.toLowerCase().includes(q) ||
          e.product_name?.toLowerCase().includes(q) ||
          e.product_sku?.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getEnquiryById(id: string): Promise<Enquiry | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*, messages:enquiry_messages(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data as Enquiry;
      } catch (err) {
        console.warn('Supabase getEnquiryById failed:', err);
      }
    }
    const list = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    return list.find((e) => e.id === id) || null;
  },

  async addEnquiryMessage(
    enquiryId: string,
    senderId: string,
    senderName: string,
    senderType: 'customer' | 'admin',
    messageText: string
  ): Promise<EnquiryMessage> {
    const newMsg: EnquiryMessage = {
      id: 'msg-' + Date.now(),
      enquiry_id: enquiryId,
      sender_id: senderId,
      sender_name: senderName,
      sender_type: senderType,
      message: messageText,
      created_at: new Date().toISOString(),
    };

    const list = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const updated = list.map((enq) => {
      if (enq.id === enquiryId) {
        const messages = [...(enq.messages || []), newMsg];
        const newStatus: EnquiryStatus = senderType === 'admin' ? 'Replied' : enq.status === 'Closed' ? 'Closed' : 'In Review';
        return {
          ...enq,
          status: newStatus,
          updated_at: new Date().toISOString(),
          messages,
        };
      }
      return enq;
    });
    setLocalItem(STORAGE_KEYS.ENQUIRIES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('enquiry_messages').insert([newMsg]);
        await supabase.from('enquiries').update({
          status: senderType === 'admin' ? 'Replied' : 'In Review',
          updated_at: new Date().toISOString(),
        }).eq('id', enquiryId);
      } catch (err) {
        console.warn('Supabase add message failed:', err);
      }
    }

    return newMsg;
  },

  async updateEnquiryStatus(enquiryId: string, status: EnquiryStatus, adminNotes?: string): Promise<void> {
    const list = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const updated = list.map((enq) => {
      if (enq.id === enquiryId) {
        return {
          ...enq,
          status,
          admin_notes: adminNotes !== undefined ? adminNotes : enq.admin_notes,
          updated_at: new Date().toISOString(),
        };
      }
      return enq;
    });
    setLocalItem(STORAGE_KEYS.ENQUIRIES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const payload: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
        if (adminNotes !== undefined) payload.admin_notes = adminNotes;
        await supabase.from('enquiries').update(payload).eq('id', enquiryId);
      } catch (err) {
        console.warn('Supabase update enquiry status failed:', err);
      }
    }
  },

  // ADMIN PRODUCT CRUD
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProd: Product = {
      ...product,
      id: 'prod-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = [newProd, ...current];
    setLocalItem(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert([newProd]);
      } catch (err) {
        console.warn('Supabase createProduct failed:', err);
      }
    }
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    let updatedProd: Product | null = null;
    const updatedList = current.map((p) => {
      if (p.id === id) {
        updatedProd = { ...p, ...updates, updated_at: new Date().toISOString() };
        return updatedProd;
      }
      return p;
    });
    setLocalItem(STORAGE_KEYS.PRODUCTS, updatedList);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateProduct failed:', err);
      }
    }
    return updatedProd;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const current = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = current.filter((p) => p.id !== id);
    setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProduct failed:', err);
      }
    }
    return true;
  },

  // STATS
  async getAdminStats(): Promise<{
    totalProducts: number;
    totalEnquiries: number;
    newEnquiries: number;
    pendingReplies: number;
    estimatedPipelineValue: number;
  }> {
    const products = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const enquiries = getLocalItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);

    const newEnquiries = enquiries.filter((e) => e.status === 'New').length;
    const inReview = enquiries.filter((e) => e.status === 'In Review').length;
    const pendingReplies = newEnquiries + inReview;

    const estimatedPipelineValue = enquiries.reduce((sum, e) => {
      const prod = products.find((p) => p.id === e.product_id || p.sku === e.product_sku);
      const unitPrice = prod?.price || 1500;
      return sum + (e.quantity || 20) * unitPrice;
    }, 0);

    return {
      totalProducts: products.length,
      totalEnquiries: enquiries.length,
      newEnquiries,
      pendingReplies,
      estimatedPipelineValue,
    };
  },
};
