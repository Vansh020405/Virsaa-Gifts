'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import EnquiryModal from '../../components/EnquiryModal';
import AuthModal from '../../components/AuthModal';
import { dbService } from '../../lib/supabase/db-service';
import { Product, Category, Collection } from '../../lib/supabase/types';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Filter, 
  Sparkles, 
  ChevronDown, 
  RotateCcw,
  Check,
  Grid,
  Layers,
  Leaf,
  Clock,
  Shield
} from 'lucide-react';

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedSpeed, setSelectedSpeed] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');

  // Mobile Filter Drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Enquiry Modal
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<Product | null>(null);

  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catData, colData, prodData] = await Promise.all([
          dbService.getCategories(),
          dbService.getCollections(),
          dbService.getProducts(),
        ]);
        setCategories(catData);
        setCollections(colData);
        setProducts(prodData.products);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenEnquiry = (prod?: Product) => {
    setSelectedProductForEnquiry(prod || null);
    setIsEnquiryOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedTier('all');
    setSelectedSpeed('all');
    setSelectedCollection('all');
    setPriceRange(6000);
    setSortBy('featured');
    setVisibleCount(6);
  };

  const materialsList = ['Wood', 'Bamboo', 'Cork', 'MDF', 'Moss', 'Brass'];
  const tiersList = ['Signature', 'Executive', 'Artisan Luxe', 'Eco Essentials'];
  const speedList = ['Ready to Ship', '3-5 Days', '7-10 Days', 'Custom Made (14 Days)'];

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.material_tags.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.category_id === selectedCategory ||
          p.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedMaterial !== 'all') {
      list = list.filter((p) => p.material_tags.includes(selectedMaterial));
    }

    if (selectedTier !== 'all') {
      list = list.filter((p) => p.tier === selectedTier);
    }

    if (selectedSpeed !== 'all') {
      list = list.filter((p) => p.speed === selectedSpeed);
    }

    if (selectedCollection !== 'all') {
      list = list.filter((p) =>
        p.collections?.some((c) => c.toLowerCase().includes(selectedCollection.toLowerCase()))
      );
    }

    list = list.filter((p) => p.price <= priceRange);

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // featured
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedMaterial,
    selectedTier,
    selectedSpeed,
    selectedCollection,
    priceRange,
    sortBy,
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar onOpenEnquiry={() => handleOpenEnquiry()} />
      <AuthModal />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedProduct={selectedProductForEnquiry}
      />

      {/* Catalogue Header */}
      <div className="pt-28 pb-10 bg-gradient-to-b from-[#1F332B] to-[#12211B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#E4B58A] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Artisan Sourcing & Bespoke B2B Curation</span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
              The Sustainable Gifting Catalogue
            </h1>
            <p className="text-sm sm:text-base text-stone-300">
              Browse our curated creations across natural wood, cork, bamboo and moss décor. Request custom quantities and branding options with instant B2B quotations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalogue Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Search & Top Action Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DFC8] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, material, or keyword..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#DCD1C4] rounded-xl text-sm text-[#1F332B] placeholder-stone-400 focus:outline-hidden focus:border-[#C88B56]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden px-4 py-2 rounded-xl bg-[#1F332B] text-white text-xs font-semibold flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#E4B58A]" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#DCD1C4] rounded-xl px-3 py-2 text-xs font-semibold text-[#1F332B] focus:outline-hidden focus:border-[#C88B56]"
              >
                <option value="featured">Featured / Best Matches</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            {/* Total count badge */}
            <span className="text-xs text-stone-500 font-medium hidden lg:inline">
              Showing <strong className="text-[#1F332B]">{filteredProducts.length}</strong> creations
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Sidebar on Left, Products on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ========================================================================= */}
          {/* DESKTOP FILTER SIDEBAR */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C88B56]" />
                  <h3 className="font-serif-luxury font-bold text-base text-[#1F332B]">Refine Catalogue</h3>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#C88B56] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>

              {/* 1. Category */}
              <div>
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2.5">
                  Category
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-[#1F332B] text-white font-bold'
                        : 'text-stone-600 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-[#1F332B] text-white font-bold'
                          : 'text-stone-600 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Material */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2.5">
                  Material
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedMaterial('all')}
                    className={`text-xs px-2.5 py-1 rounded-full border transition ${
                      selectedMaterial === 'all'
                        ? 'bg-[#C88B56] text-white border-[#C88B56] font-semibold'
                        : 'bg-[#FAF8F5] text-stone-600 border-[#DCD1C4] hover:bg-[#EFE9DE]'
                    }`}
                  >
                    All
                  </button>
                  {materialsList.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(m)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        selectedMaterial === m
                          ? 'bg-[#C88B56] text-white border-[#C88B56] font-semibold'
                          : 'bg-[#FAF8F5] text-stone-600 border-[#DCD1C4] hover:bg-[#EFE9DE]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Price Range Slider */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1F332B] uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-[#C88B56]">
                    ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C88B56] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹500</span>
                  <span>₹6,000+</span>
                </div>
              </div>

              {/* 4. Tier */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2.5">
                  Tier
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedTier('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedTier === 'all'
                        ? 'bg-[#1F332B] text-white font-bold'
                        : 'text-stone-600 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    All Tiers
                  </button>
                  {tiersList.map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedTier === tier
                          ? 'bg-[#1F332B] text-white font-bold'
                          : 'text-stone-600 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Speed / Lead Time */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2.5">
                  Lead Time / Speed
                </label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedSpeed('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      selectedSpeed === 'all'
                        ? 'bg-[#1F332B] text-white font-bold'
                        : 'text-stone-600 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Any Speed
                  </button>
                  {speedList.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSelectedSpeed(speed)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedSpeed === speed
                          ? 'bg-[#1F332B] text-white font-bold'
                          : 'text-stone-600 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* PRODUCT GRID ON RIGHT */}
          {/* ========================================================================= */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-[#E8DFC8]" />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFC8]">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center mx-auto mb-4 text-[#C88B56]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#1F332B]">No gifts matched your criteria</h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto mt-2 mb-6">
                  Try adjusting your material tags, expanding price limits or clearing your search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#1F332B] text-white text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEnquire={(prod) => handleOpenEnquiry(prod)}
                    />
                  ))}
                </div>

                {/* Pagination / Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1F332B] font-bold text-xs sm:text-sm border border-[#DCD1C4] shadow-xs hover:shadow transition"
                    >
                      Load More Products ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FILTER DRAWER */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#FAF8F5] h-full ml-auto flex flex-col p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
              <h3 className="font-serif-luxury font-bold text-lg text-[#1F332B]">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-stone-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DCD1C4] text-xs font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2">
                  Material
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DCD1C4] text-xs font-medium"
                >
                  <option value="all">All Materials</option>
                  {materialsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Max Price:</span>
                  <span className="text-[#C88B56]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="250"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C88B56]"
                />
              </div>

              {/* Tier */}
              <div>
                <label className="block text-xs font-bold text-[#1F332B] uppercase tracking-wider mb-2">
                  Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DCD1C4] text-xs font-medium"
                >
                  <option value="all">All Tiers</option>
                  {tiersList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E8DFC8] flex gap-3">
              <button
                onClick={handleResetFilters}
                className="py-3 px-4 rounded-xl border border-[#DCD1C4] text-xs font-medium text-stone-700 w-1/3"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="py-3 px-4 rounded-xl bg-[#1F332B] text-white text-xs font-bold w-2/3"
              >
                View ({filteredProducts.length}) Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
