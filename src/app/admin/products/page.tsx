'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { dbService } from '../../../lib/supabase/db-service';
import { Product, Category, ProductTier, SpeedType } from '../../../lib/supabase/types';
import { getProductImageUrl, uploadProductImageToStorage, deleteProductImageFromStorage } from '../../../lib/supabase/storage';
import ProductDetailModal from '../../../components/ProductDetailModal';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Star, 
  Check, 
  X, 
  Upload, 
  Layers, 
  RotateCcw, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  const [formSubcategory, setFormSubcategory] = useState('Desk Décor');
  const [formPrice, setFormPrice] = useState(1500);
  const [formGst, setFormGst] = useState(18);
  const [formDescription, setFormDescription] = useState('');
  const [formPrimaryUseCase, setFormPrimaryUseCase] = useState('');
  const [formMaterials, setFormMaterials] = useState<string[]>(['Wood']);
  const [formTier, setFormTier] = useState<ProductTier>('Signature');
  const [formSpeed, setFormSpeed] = useState<SpeedType>('3-5 Days');
  const [formImageUrl, setFormImageUrl] = useState('');
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
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`VG-CUSTOM-${Math.floor(10 + Math.random() * 90)}`);
    setFormCategoryId(categories[0]?.id || 'cat-1');
    setFormSubcategory('Desk Organizers');
    setFormPrice(1750);
    setFormGst(18);
    setFormDescription('Handcrafted sustainable corporate gifting creation made with certified natural materials.');
    setFormPrimaryUseCase('Corporate Welcome Kits & Leadership Conclaves');
    setFormMaterials(['Wood', 'Moss']);
    setFormTier('Signature');
    setFormSpeed('3-5 Days');
    setFormImageUrl('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80');
    setFormFeatured(true);
    setFormMinOrder(15);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategoryId(p.category_id);
    setFormSubcategory(p.subcategory);
    setFormPrice(p.price);
    setFormGst(p.gst_percent);
    setFormDescription(p.description);
    setFormPrimaryUseCase(p.primary_use_case);
    setFormMaterials(p.material_tags);
    setFormTier(p.tier);
    setFormSpeed(p.speed);
    setFormImageUrl(p.images?.[0]?.storage_path || '');
    setFormFeatured(Boolean(p.featured));
    setFormMinOrder(p.min_order_qty || 10);
    setModalOpen(true);
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

    setSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === formCategoryId);
      const payload: Partial<Product> = {
        name: formName,
        sku: formSku,
        category_id: formCategoryId,
        category_name: selectedCat?.name || 'Home & Décor',
        subcategory: formSubcategory,
        price: Number(formPrice),
        gst_percent: Number(formGst),
        description: formDescription,
        primary_use_case: formPrimaryUseCase,
        material_tags: formMaterials,
        tier: formTier,
        speed: formSpeed,
        featured: formFeatured,
        min_order_qty: Number(formMinOrder),
        images: [
          {
            id: 'img-' + Date.now(),
            product_id: editingProduct?.id || 'new',
            storage_path: formImageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
            image_type: 'primary',
            sort_order: 1,
          },
        ],
      };

      if (editingProduct) {
        await dbService.updateProduct(editingProduct.id, payload);
      } else {
        await dbService.createProduct(payload as any);
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
            <span>Catalogue Studio</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#1F332B]">
            Product & Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse {products.length} live products, adjust institutional pricing, manage images and tiers.
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
                <h3 className="font-serif-luxury font-bold text-lg">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Sustainable Creation'}
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
                  </select>
                </div>

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
                    onChange={(e) => setFormTier(e.target.value as ProductTier)}
                    className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                  >
                    <option value="Signature">Signature</option>
                    <option value="Executive">Executive</option>
                    <option value="Artisan Luxe">Artisan Luxe</option>
                    <option value="Eco Essentials">Eco Essentials</option>
                  </select>
                </div>

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

              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-semibold text-[#1F332B] mb-1">
                  Product Image URL (Unsplash or Supabase Storage)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-[#DCD1C4] rounded-xl text-xs"
                />
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
