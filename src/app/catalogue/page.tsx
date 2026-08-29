'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import ProductDetailModal from '../../components/ProductDetailModal';
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
  Columns2,
  Columns3,
  LayoutList,
  Layers,
  Leaf,
  Clock,
  Shield,
  PackageCheck
} from 'lucide-react';

export default function CataloguePage() {
  type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc';
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
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Mobile Filter Drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Modals
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState<Product | null>(null);

  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState(18);

  // Mobile grid columns selector
  const [mobileColumns, setMobileColumns] = useState<'one' | 'two' | 'three'>('two');

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
    setPriceRange(5000);
    setSortBy('featured');
    setMobileColumns('two');
    setVisibleCount(18);
  };

  // Derive unique materials from products
  const materialsList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.material_tags?.forEach((m) => {
        if (m && m.trim()) set.add(m.trim());
      });
    });
    const popular = ['Cork', 'Seed Paper', 'Recycled Paper', 'Bamboo', 'MDF', 'Wax', 'Preserved Botanicals', 'Metal', 'Seeds', 'Coir', 'Glass', 'Moss', 'Wood'];
    return popular.filter(m => set.has(m)).concat(Array.from(set).filter(m => !popular.includes(m)));
  }, [products]);

  const tiersList = ['Essential', 'Premium', 'Signature', 'Luxury'];
  const speedList = ['Ready to Ship', '3-5 Days', '7-10 Days'];

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
          p.material_tags?.some((m) => m.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      const activeCat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
      list = list.filter((p) =>
        p.category_id === selectedCategory ||
        (activeCat
          ? p.category_id === activeCat.id || p.category_name?.toLowerCase() === activeCat.name.toLowerCase()
          : p.category_name?.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (selectedMaterial !== 'all') {
      list = list.filter((p) => p.material_tags?.includes(selectedMaterial));
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
      // featured: high tiers and catalog items first
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }

    return list;
  }, [products, categories, searchQuery, selectedCategory, selectedMaterial, selectedTier, selectedSpeed, selectedCollection, priceRange, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterial !== 'all') count++;
    if (selectedTier !== 'all') count++;
    if (selectedSpeed !== 'all') count++;
    if (selectedCollection !== 'all') count++;
    if (priceRange < 5000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedMaterial, selectedTier, selectedSpeed, selectedCollection, priceRange, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <AuthModal />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedProduct={selectedProductForEnquiry}
      />

      {/* Product Quick-View Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onEnquire={(p) => handleOpenEnquiry(p)}
      />

      {/* Page Header */}
      <div className="pt-36 pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1F332B] mb-3">
              Sustainable Corporate Gifts & Keepsakes
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
              Explore authentic eco-conscious gifts made with cork, seed paper, bamboo, reclaimed timber and preserved botanicals. Click any product to view its complete specifications and photo gallery.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalogue Area */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Top Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

          {/* Search Input */}
          <div className="relative w-full md:w-[26rem]">
            <Search className="w-4 h-4 text-[#C88B56] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, SKU (e.g. 4ck03), material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-full border border-[#E6DCCE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C88B56]/40 focus:border-[#C88B56] text-xs sm:text-sm text-[#1F332B] placeholder:text-stone-400 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F0EAE1] hover:bg-[#E4DBCB] text-stone-500 hover:text-stone-700 flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 rounded-full border border-[#E6DCCE] bg-white text-xs font-semibold text-[#1F332B] shadow-sm transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C88B56]" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline font-sans">
                Sort by
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-9 py-3 rounded-full border border-[#E6DCCE] bg-white text-xs font-semibold text-[#1F332B] focus:outline-none focus:ring-2 focus:ring-[#C88B56]/40 focus:border-[#C88B56] shadow-sm cursor-pointer transition-all font-sans"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#C88B56] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Products List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* DESKTOP SIDEBAR FILTERS */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 border border-[#EBE4D8] shadow-sm space-y-7 sticky top-9 max-h-[85vh] overflow-y-auto pr-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D8C9B8] [scrollbar-width:thin] [scrollbar-color:#D8C9B8_transparent]">
            
            {/* Filters Header */}
            <div className="flex items-center justify-between pb-5 border-b border-[#EBE4D8]">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#1F332B]/[0.06] flex items-center justify-center">
                  <Filter className="w-4 h-4 text-[#C88B56]" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1F332B] tracking-tight font-sans">Filters</h3>
                  <p className="text-[10px] text-stone-400 font-medium font-sans">
                    {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Refine your results'}
                  </p>
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-[#C88B56] hover:text-[#9E5A38] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block mb-3 font-sans">
                Categories
              </label>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-[#1F332B] font-bold'
                      : 'text-stone-600 hover:text-[#1F332B]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${selectedCategory === 'all' ? 'bg-[#C88B56]' : 'bg-stone-300'}`} />
                  <span className="flex-1">All Products</span>
                  <span className="text-[10px] text-stone-400 font-medium">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(
                    (p) => p.category_id === cat.id || p.category_name?.toLowerCase() === cat.name.toLowerCase()
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`flex items-center gap-2.5 w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium font-sans transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-[#1F332B] font-bold'
                          : 'text-stone-600 hover:text-[#1F332B]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${selectedCategory === cat.slug ? 'bg-[#C88B56]' : 'bg-stone-300'}`} />
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-[10px] text-stone-400 font-medium">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <label className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block mb-3 flex items-center gap-1.5 font-sans">
                <Leaf className="w-3.5 h-3.5 text-[#2D4A3E]" />
                <span>Materials</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedMaterial('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
                    selectedMaterial === 'all'
                      ? 'bg-[#C88B56] text-white shadow-md shadow-[#C88B56]/25'
                      : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                  }`}
                >
                  All
                </button>
                {materialsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
                      selectedMaterial === m
                        ? 'bg-[#C88B56] text-white shadow-md shadow-[#C88B56]/25'
                        : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <label className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block mb-3 font-sans">
                Product Tier
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedTier('all')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold font-sans text-center transition-all ${
                    selectedTier === 'all'
                      ? 'bg-[#1F332B] text-white shadow-md shadow-[#1F332B]/15'
                      : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                  }`}
                >
                  All Tiers
                </button>
                {tiersList.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTier(t)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold font-sans text-center transition-all ${
                      selectedTier === t
                        ? 'bg-[#1F332B] text-white shadow-md shadow-[#1F332B]/15'
                        : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed / Lead Time */}
            <div>
              <label className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block mb-3 flex items-center gap-1.5 font-sans">
                <Clock className="w-3.5 h-3.5 text-[#C88B56]" />
                <span>Turnaround Time</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSpeed('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
                    selectedSpeed === 'all'
                      ? 'bg-[#1F332B] text-white shadow-md shadow-[#1F332B]/20'
                      : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                  }`}
                >
                  All Timelines
                </button>
                {speedList.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSpeed(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans transition-all ${
                      selectedSpeed === s
                        ? 'bg-[#1F332B] text-white shadow-md shadow-[#1F332B]/20'
                        : 'bg-[#FAF8F5] text-stone-700 border border-[#EBE4D8] hover:border-[#C88B56]/60 hover:text-[#1F332B]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] uppercase font-bold text-stone-500 tracking-wider font-sans">
                  Max Unit Price
                </label>
                <span className="text-xs font-bold text-[#1F332B] text-stone-800 font-sans">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#C88B56] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-sans">
                <span>₹50</span>
                <span>₹5,000+</span>
              </div>
            </div>

          </aside>

          {/* ========================================================================= */}
          {/* PRODUCTS GRID */}
          {/* ========================================================================= */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Active Filter Pills Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3.5 rounded-2xl border border-[#EBE4D8]">
                <span className="text-xs text-stone-400 font-medium">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DCD1C4] text-stone-700">
                    &quot;{searchQuery}&quot;
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DCD1C4] text-stone-700">
                    Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </span>
                )}
                {selectedMaterial !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DCD1C4] text-stone-700">
                    Material: {selectedMaterial}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedMaterial('all')} />
                  </span>
                )}
                {selectedTier !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DCD1C4] text-stone-700">
                    Tier: {selectedTier}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedTier('all')} />
                  </span>
                )}
                {selectedSpeed !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DCD1C4] text-stone-700">
                    Speed: {selectedSpeed}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSpeed('all')} />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#C88B56] font-bold hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Count Header */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Showing <strong className="text-[#1F332B]">{Math.min(visibleCount, filteredProducts.length)}</strong> of <strong className="text-[#1F332B]">{filteredProducts.length}</strong> matching products
              </p>

              {/* Mobile Layout Selector */}
              <div className="lg:hidden flex items-center gap-1 rounded-full border border-[#E6DCCE] bg-white p-1 shadow-sm">
                <Grid className="w-3.5 h-3.5 text-[#C88B56] ml-2" aria-hidden />
                {([
                  { value: 'one' as const, Icon: LayoutList, label: '1' },
                  { value: 'two' as const, Icon: Columns2, label: '2' },
                  { value: 'three' as const, Icon: Columns3, label: '3' },
                ]).map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setMobileColumns(value)}
                    aria-label={`${label} column layout`}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      mobileColumns === value
                        ? 'bg-[#1F332B] text-white shadow-sm'
                        : 'text-stone-500 hover:text-[#1F332B]'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className={`grid ${mobileColumns === 'one' ? 'grid-cols-1' : mobileColumns === 'two' ? 'grid-cols-2' : 'grid-cols-3'} sm:grid-cols-2 xl:grid-cols-3 gap-6`}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl h-96 border border-[#EBE4D8] animate-pulse p-4 space-y-4">
                    <div className="bg-stone-200 aspect-4/3 rounded-xl" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                    <div className="h-3 bg-stone-200 rounded w-full" />
                    <div className="h-8 bg-stone-200 rounded mt-auto" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE4D8] shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-4 text-[#C88B56]">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1F332B] mb-2">
                  No Products Match Your Criteria
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Try adjusting your filters, clearing search keywords, or exploring our broader categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#1F332B] text-white text-xs font-bold shadow hover:bg-[#2D4A3E] transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid ${mobileColumns === 'one' ? 'grid-cols-1' : mobileColumns === 'two' ? 'grid-cols-2' : 'grid-cols-3'} sm:grid-cols-2 xl:grid-cols-3 gap-6`}>
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard
                      key={product.id || product.sku}
                      product={product}
                      onSelectProduct={(prod) => setSelectedProductForDetail(prod)}
                      onEnquire={(prod) => handleOpenEnquiry(prod)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="pt-8 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 18)}
                      className="px-8 py-3.5 rounded-full bg-white border border-[#DCD1C4] hover:bg-[#FAF8F5] text-[#1F332B] text-xs font-bold shadow-xs hover:shadow transition-all inline-flex items-center gap-2"
                    >
                      <span>Load More Products ({filteredProducts.length - visibleCount} remaining)</span>
                      <ChevronDown className="w-4 h-4 text-[#C88B56]" />
                    </button>
                  </div>
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FILTERS DRAWER MODAL */}
      {/* ========================================================================= */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EBE4D8] mb-6">
                <h3 className="text-lg font-bold text-[#1F332B] font-sans">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="text-[11px] uppercase font-bold text-stone-500 block mb-2 font-sans">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCD1C4] text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Material */}
              <div className="mb-6">
                <label className="text-[11px] uppercase font-bold text-stone-500 block mb-2 font-sans">Material</label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCD1C4] text-xs"
                >
                  <option value="all">All Materials</option>
                  {materialsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div className="mb-6">
                <label className="text-[11px] uppercase font-bold text-stone-500 block mb-2 font-sans">Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCD1C4] text-xs"
                >
                  <option value="all">All Tiers</option>
                  {tiersList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Max Unit Price</span>
                  <span className="text-[#C88B56]">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C88B56]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE4D8] space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-[#1F332B] text-white text-xs font-bold"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
