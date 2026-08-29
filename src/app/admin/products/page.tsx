'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { dbService } from '../../../lib/supabase/db-service';
import { Product, Category, ProductTier, SpeedType, ProductImage } from '../../../lib/supabase/types';
import { getProductImageUrl, uploadProductImageToStorage, DEFAULT_PLACEHOLDER } from '../../../lib/supabase/storage';
import ProductDetailModal from '../../../components/ProductDetailModal';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Upload, 
  X, 
  Eye, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type FormImage = {
  id: string;
  storage_path: string;
  image_type: 'primary' | 'gallery' | 'packaging' | 'craft';
  sort_order: number;
  file?: File;
  previewUrl?: string;
};

const TIER_OPTIONS: ProductTier[] = [
  'Essential',
  'Premium',
  'Signature',
  'Luxury',
  'Executive',
  'Artisan Luxe',
  'Eco Essentials',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedPreviewProduct, setSelectedPreviewProduct] = useState<Product | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Form fields
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('cat-1');
  const [formNewCategory, setFormNewCategory] = useState('');
  const [formSubcategory, setFormSubcategory] = useState('Desk Décor');
  const [formPrice, setFormPrice] = useState(1500);
  const [formGst, setFormGst] = useState(18);
  const [formDescription, setFormDescription] = useState('');
  const [formPrimaryUseCase, setFormPrimaryUseCase] = useState('');
  const [formMaterials, setFormMaterials] = useState<string[]>(['Wood']);
  const [formTier, setFormTier] = useState<ProductTier | '__new'>('Signature');
  const [formNewTier, setFormNewTier] = useState('');
  const [formSpeed, setFormSpeed] = useState<SpeedType>('3-5 Days');
  const [formImages, setFormImages] = useState<FormImage[]>([]);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formMinOrder, setFormMinOrder] = useState(15);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        dbService.getProducts(),
        dbService.getCategories(),
      ]);
      setProducts(prodData.products);
      setCategories(catData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prodData, catData] = await Promise.all([
          dbService.getProducts(),
          dbService.getCategories(),
        ]);
        if (cancelled) return;
        setProducts(prodData.products);
        setCategories(catData);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`VG-CUSTOM-${Math.floor(10 + Math.random() * 90)}`);
    setFormCategoryId(categories[0]?.id || 'cat-1');
    setFormNewCategory('');
    setFormSubcategory('Desk Organizers');
    setFormPrice(1750);
    setFormGst(18);
    setFormDescription('Handcrafted sustainable corporate gifting creation made with certified natural materials.');
    setFormPrimaryUseCase('Corporate Welcome Kits & Leadership Conclaves');
    setFormMaterials(['Wood', 'Moss']);
    setFormTier('Signature');
    setFormNewTier('');
    setFormSpeed('3-5 Days');
    setFormImages([]);
    setFormFeatured(true);
    setFormMinOrder(15);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategoryId(p.category_id);
    setFormNewCategory('');
    setFormSubcategory(p.subcategory);
    setFormPrice(p.price);
    setFormGst(p.gst_percent);
    setFormDescription(p.description);
    setFormPrimaryUseCase(p.primary_use_case);
    setFormMaterials(p.material_tags);
    setFormTier(p.tier);
    setFormNewTier('');
    setFormSpeed(p.speed);
    setFormImages(
      (p.images || []).map((img, i) => ({
        id: img.id,
        storage_path: img.storage_path,
        image_type: img.image_type,
        sort_order: img.sort_order || i + 1,
      }))
    );
    setFormFeatured(Boolean(p.featured));
    setFormMinOrder(p.min_order_qty || 10);
    setModalOpen(true);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormImages((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        id: `img-${Date.now()}-${i}`,
        storage_path: '',
        image_type: (prev.length + i === 0 ? 'primary' : 'gallery') as FormImage['image_type'],
        sort_order: prev.length + i + 1,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
    e.target.value = '';
  };

  const handleRemoveImage = (id: string) => {
    setFormImages((prev) =>
      prev
        .filter((img) => img.id !== id)
        .map((img, i) => ({ ...img, sort_order: i + 1 }))
    );
  };

  const handleSetCoverImage = (id: string) => {
    setFormImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (!target) return prev;
      const rest = prev.filter((img) => img.id !== id);
      return [
        { ...target, image_type: 'primary' as const, sort_order: 1 },
        ...rest.map((img, i) => ({
          ...img,
          image_type: img.image_type === 'primary' ? ('gallery' as const) : img.image_type,
          sort_order: i + 2,
        })),
      ];
    });
  };

  const toggleMaterial = (m: string) => {
    if (formMaterials.includes(m)) {
      setFormMaterials(formMaterials.filter((item) => item !== m));
    } else {
      setFormMaterials([...formMaterials, m]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku) return;

    const newCategoryName = formNewCategory.trim();
    if (formCategoryId === '__new' && !newCategoryName) {
      window.alert('Enter a name for the new category.');
      return;
    }

    const finalTier = formTier === '__new' ? formNewTier.trim() : formTier;
    if (formTier === '__new' && !finalTier) {
      window.alert('Enter a name for the new tier.');
      return;
    }

    setSaving(true);
    try {
      let finalCategoryId = formCategoryId;
      let categoryName: string | undefined;
      if (formCategoryId === '__new') {
        const newCat = await dbService.createCategory({
          name: newCategoryName,
          slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        });
        finalCategoryId = newCat.id;
        categoryName = newCat.name;
        setCategories((prev) => [...prev, newCat]);
      } else {
        categoryName = categories.find((c) => c.id === finalCategoryId)?.name || 'Home & Décor';
      }

      const productId = editingProduct?.id || 'new';
      const productImages: ProductImage[] = [];
      for (const img of formImages) {
        if (img.file) {
          const res = await uploadProductImageToStorage(formSku, img.file, img.image_type, img.sort_order);
          if (res) {
            productImages.push({
              id: `img-${Date.now()}-${img.sort_order}`,
              product_id: productId,
              storage_path: res.storagePath,
              image_type: img.image_type,
              sort_order: img.sort_order,
            });
          }
        } else {
          productImages.push({
            id: img.id,
            product_id: productId,
            storage_path: img.storage_path,
            image_type: img.image_type,
            sort_order: img.sort_order,
          });
        }
      }
      if (productImages.length === 0) {
        productImages.push({
          id: `img-${Date.now()}`,
          product_id: productId,
          storage_path: DEFAULT_PLACEHOLDER,
          image_type: 'primary',
          sort_order: 1,
        });
      }

      const payload = {
        name: formName,
        sku: formSku,
        category_id: finalCategoryId,
        category_name: categoryName,
        subcategory: formSubcategory,
        price: Number(formPrice),
        gst_percent: Number(formGst),
        description: formDescription,
        specification: {},
        primary_use_case: formPrimaryUseCase,
        secondary_use_cases: [],
        material_tags: formMaterials,
        tier: finalTier as ProductTier,
        speed: formSpeed,
        featured: formFeatured,
        min_order_qty: Number(formMinOrder),
        images: productImages,
      };

      if (editingProduct) {
        await dbService.updateProduct(editingProduct.id, payload);
      } else {
        await dbService.createProduct(payload);
      }

      setModalOpen(false);
      await loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete/archive "${name}"?`)) {
      await dbService.deleteProduct(id);
      await loadProducts();
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    await dbService.updateProduct(p.id, { featured: !p.featured });
    await loadProducts();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.material_tags.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedPreviewProduct}
        isOpen={!!selectedPreviewProduct}
        onClose={() => setSelectedPreviewProduct(null)}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C88B56] font-bold mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Products</span>
          </div>
          <h1 className="font-sans text-3xl font-bold tracking-tight text-[#1F332B]">
            Products
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Add, edit and manage the catalogue — pricing, images and tiers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-[#C88B56] hover:bg-[#b87944] text-white font-bold text-xs flex items-center gap-2 shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar & Pagination Stats */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products by title, SKU (e.g. 4ck03), or materials..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F5] border border-[#DCD1C4] rounded-xl text-xs text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-500 font-medium">
          <span>Showing {paginatedProducts.length} of {filteredProducts.length} products</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#DCD1C4] disabled:opacity-40 hover:bg-[#FAF8F5] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[#1F332B]">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#DCD1C4] disabled:opacity-40 hover:bg-[#FAF8F5] transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500 animate-pulse text-xs">
            Loading products from database...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs">
            No products found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8DFC8] bg-[#FAF8F5] text-stone-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3.5 px-6">Product & SKU</th>
                  <th className="py-3.5 px-6">Category & Material</th>
                  <th className="py-3.5 px-6">B2B Rate</th>
                  <th className="py-3.5 px-6">Tier / Speed</th>
                  <th className="py-3.5 px-6 text-center">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE1]">
                {paginatedProducts.map((prod) => (
                  <tr key={prod.id || prod.sku} className="hover:bg-[#FAF8F5]/80 transition">
                    {/* 1. Product & SKU */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => setSelectedPreviewProduct(prod)}
                          className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-[#E8DFC8] cursor-pointer hover:opacity-80"
                        >
                          <Image
                            src={prod.images?.[0] ? getProductImageUrl(prod.images[0]) : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p 
                            onClick={() => setSelectedPreviewProduct(prod)}
                            className="font-bold text-[#1F332B] line-clamp-1 max-w-[220px] cursor-pointer hover:text-[#C88B56]"
                          >
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-stone-500 font-semibold">{prod.sku}</span>
                            {prod.images && prod.images.length > 1 && (
                              <span className="text-[9px] text-stone-400">({prod.images.length} photos)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Category & Materials */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#1F332B]">{prod.category_name || prod.subcategory}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[160px]">
                        {prod.material_tags.join(', ')}
                      </p>
                    </td>

                    {/* 3. Price */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1F332B]">₹{prod.price.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] text-stone-500">+{prod.gst_percent}% GST</span>
                    </td>

                    {/* 4. Tier & Speed */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] text-[#1F332B] border border-stone-300 w-max">
                          {prod.tier}
                        </span>
                        <span className="text-[10px] text-stone-500">{prod.speed}</span>
                      </div>
                    </td>

                    {/* 5. Featured Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-full transition ${prod.featured ? 'text-amber-500 hover:text-amber-600 bg-amber-50' : 'text-stone-300 hover:text-stone-400'}`}
                      >
                        <Star className={`w-4 h-4 ${prod.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* 6. Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPreviewProduct(prod)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
                          title="Quick View Modal"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C88B56]" />
                        </button>

                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E8DFC8] bg-[#FAF8F5] flex items-center justify-between text-xs">
            <span className="text-stone-500">
              Page {currentPage} of {totalPages} ({filteredProducts.length} total products)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#DCD1C4] disabled:opacity-40 font-semibold"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#DCD1C4] disabled:opacity-40 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-8">
            <div className="bg-[#1F332B] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#E4B58A]" />
                <h3 className="font-sans font-bold text-lg">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Product'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Teak & Preserved Moss Desk Clock"
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="VG-MOSS-09"
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                    <option value="__new">+ New Category...</option>
                  </select>
                </div>

                {formCategoryId === '__new' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1F332B] mb-1">New Category Name</label>
                    <input
                      type="text"
                      value={formNewCategory}
                      onChange={(e) => setFormNewCategory(e.target.value)}
                      placeholder="e.g. Travel & Conference"
                      className="w-full px-3 py-2 bg-white border border-[#C88B56] rounded-xl text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="Desk Organizers / Wall Decor"
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">B2B Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">GST Percent (%)</label>
                  <input
                    type="number"
                    value={formGst}
                    onChange={(e) => setFormGst(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">Tier</label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as ProductTier | '__new')}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  >
                    {formTier && !TIER_OPTIONS.includes(formTier as ProductTier) && formTier !== '__new' && (
                      <option value={formTier}>{formTier}</option>
                    )}
                    {TIER_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="__new">+ New Tier...</option>
                  </select>
                </div>

                {formTier === '__new' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1F332B] mb-1">New Tier Name</label>
                    <input
                      type="text"
                      value={formNewTier}
                      onChange={(e) => setFormNewTier(e.target.value)}
                      placeholder="e.g. Bespoke"
                      className="w-full px-3 py-2 bg-white border border-[#C88B56] rounded-xl text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1F332B] mb-1">Production Speed / Lead Time</label>
                  <select
                    value={formSpeed}
                    onChange={(e) => setFormSpeed(e.target.value as SpeedType)}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  >
                    <option value="Ready to Ship">Ready to Ship</option>
                    <option value="3-5 Days">3-5 Days</option>
                    <option value="7-10 Days">7-10 Days</option>
                    <option value="Custom Made (14 Days)">Custom Made (14 Days)</option>
                  </select>
                </div>
              </div>

              {/* Materials Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1.5">
                  Natural Materials
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Wood', 'Bamboo', 'Cork', 'MDF', 'Moss', 'Brass'].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => toggleMaterial(m)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                        formMaterials.includes(m)
                          ? 'bg-[#1F332B] text-white border-[#1F332B]'
                          : 'bg-white text-stone-600 border-[#DCD1C4]'
                      }`}
                    >
                      {formMaterials.includes(m) ? '✓ ' : '+ '}
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Images (Upload Multiple) */}
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1.5">
                  Product Images ({formImages.length})
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {formImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border border-[#E8DFC8]">
                        <Image
                          src={img.previewUrl || getProductImageUrl(img.storage_path)}
                          alt="Product"
                          fill
                          unoptimized={!!img.previewUrl}
                          className="object-cover"
                        />
                      </div>
                      {img.sort_order === 1 && (
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#1F332B] text-white shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        title="Set as cover"
                        onClick={() => handleSetCoverImage(img.id)}
                        className={`absolute bottom-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition ${
                          img.sort_order === 1
                            ? 'bg-[#C88B56] text-white'
                            : 'bg-white/90 text-stone-400 hover:text-[#C88B56]'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remove image"
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-[#DCD1C4] bg-[#FAF8F5] text-stone-400 hover:border-[#C88B56] hover:text-[#C88B56] cursor-pointer transition">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Upload</span>
                    <span className="text-[9px] text-stone-400">multiple</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAddImages}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Upload multiple images. The first image is the cover — tap the star to set another.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                />
              </div>

              {/* Primary Use Case */}
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">Primary Use Case / Best For</label>
                <input
                  type="text"
                  value={formPrimaryUseCase}
                  onChange={(e) => setFormPrimaryUseCase(e.target.value)}
                  placeholder="e.g. VIP Speaker Mementos & Leadership Onboarding"
                  className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="accent-[#C88B56] w-4 h-4 rounded"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-[#1F332B] cursor-pointer">
                  Feature on Homepage Signature Showcase
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E8DFC8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCD1C4] text-xs font-medium text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#1F332B] hover:bg-[#2D4A3E] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
