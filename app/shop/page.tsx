'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/product/ProductCard';
import { useI18n } from '../../lib/i18n/context';
import { mockCategories, mockProducts } from '../../lib/mock-data';
import { Filter, SlidersHorizontal, Search, RefreshCw, X } from 'lucide-react';

function ShopContent() {
  const { t, language } = useI18n();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [search, setSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesNameEn = product.name_en.toLowerCase().includes(q);
        const matchesNameBn = product.name_bn.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesDesc = (product.description_en || '').toLowerCase().includes(q);
        if (!matchesNameEn && !matchesNameBn && !matchesSku && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && product.category_id !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (inStockOnly && product.stock_quantity <= 0) {
        return false;
      }

      // Price filter
      const activePrice = product.sale_price !== null ? product.sale_price : product.regular_price;
      if (activePrice > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price !== null ? a.sale_price : a.regular_price;
      const priceB = b.sale_price !== null ? b.sale_price : b.regular_price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') {
        return language === 'bn'
          ? a.name_bn.localeCompare(b.name_bn)
          : a.name_en.localeCompare(b.name_en);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [search, selectedCategory, inStockOnly, maxPrice, sortBy, language]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setInStockOnly(false);
    setMaxPrice(2000);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Botanical Shop Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-forest-100 bg-forest-900 h-44 sm:h-56 flex items-center">
        <Image
          src="/images/slides/slide-1.webp"
          alt="NoniNature Shop"
          fill
          className="object-cover opacity-40 hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="relative z-10 px-6 sm:px-12 space-y-2 text-ivory">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gold bg-forest-950/60 px-3 py-1 rounded-full border border-gold/30">
            {language === 'bn' ? '১০০% খাঁটি ও প্রাকৃতিক' : '100% Pure Botanical Collection'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-ivory">
            {language === 'bn' ? 'অর্গানিক নোনি পণ্যসমগ্র' : 'Authentic Organic Noni Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 max-w-xl font-light">
            {language === 'bn'
              ? 'পরিপক্ব নোনি জুস, শুকনো স্লাইস, কলম চারা গাছ ও ভেষজ ত্বকের যত্ন—সরাসরি আমাদের বাগান থেকে।'
              : 'Direct from our Bangladesh organic orchards: pure aged juice, dried slices, seedlings & skincare.'}
          </p>
        </div>
      </div>

      {/* Title & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-forest-950">
            {t.shop}
          </h1>
          <p className="text-xs sm:text-sm text-botanicalDark/70 mt-1">
            {language === 'bn'
              ? `মোট ${filteredProducts.length} টি অর্গানিক নোনি পণ্য পাওয়া গেছে`
              : `Showing ${filteredProducts.length} organic noni products`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-forest-700 font-medium hidden sm:inline">
              {language === 'bn' ? 'সাজান:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-forest-200 rounded-xl px-3 py-2 text-xs font-semibold text-botanicalDark focus:outline-none focus:ring-2 focus:ring-leaf"
            >
              <option value="newest">{language === 'bn' ? 'নতুন পণ্য' : 'Newest'}</option>
              <option value="price-asc">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price-desc">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="name">{language === 'bn' ? 'নাম অনুসারে' : 'Product Name'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 bg-forest-900 text-ivory rounded-xl text-xs font-semibold"
          >
            <Filter className="w-4 h-4" />
            <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-forest-100/80 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-forest-100">
            <h3 className="font-bold text-sm text-forest-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-leaf" />
              <span>{language === 'bn' ? 'ফিল্টার সমূহ' : 'Filter Products'}</span>
            </h3>
            {(selectedCategory || inStockOnly || search || maxPrice < 2000) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-leaf hover:text-forest-900 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Search input in sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-forest-900 uppercase tracking-wide">
              {t.search}
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-forest-50/60 border border-forest-200 rounded-xl px-3 py-2 pl-8 text-xs focus:ring-2 focus:ring-leaf outline-none"
              />
              <Search className="w-3.5 h-3.5 text-forest-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-forest-900 uppercase tracking-wide block">
              {t.categories}
            </label>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex justify-between items-center ${
                  selectedCategory === ''
                    ? 'bg-forest-900 text-ivory font-bold'
                    : 'text-botanicalDark/80 hover:bg-forest-50'
                }`}
              >
                <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
                <span>{mockProducts.length}</span>
              </button>
              {mockCategories.map((c) => {
                const count = mockProducts.filter((p) => p.category_id === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex justify-between items-center ${
                      selectedCategory === c.id
                        ? 'bg-forest-900 text-ivory font-bold'
                        : 'text-botanicalDark/80 hover:bg-forest-50'
                    }`}
                  >
                    <span>{language === 'bn' ? c.name_bn : c.name_en}</span>
                    <span className="opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-2 border-t border-forest-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-forest-900 uppercase tracking-wide">
                {language === 'bn' ? 'সর্বোচ্চ মূল্য' : 'Max Price'}
              </label>
              <span className="font-bold text-forest-950">৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min="150"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-leaf cursor-pointer"
            />
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-forest-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-forest-900">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-forest-300 text-leaf focus:ring-leaf w-4 h-4"
              />
              <span>{language === 'bn' ? 'শুধুমাত্র স্টকে থাকা পণ্য' : 'In-Stock Only'}</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-forest-100 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest-50 mx-auto flex items-center justify-center text-forest-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-forest-950 font-serif">
                {language === 'bn' ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No Products Found'}
              </h3>
              <p className="text-xs text-botanicalDark/70 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার ফিল্টার বা অনুসন্ধানের কিওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                  : 'Try adjusting your filters, price range, or search keywords.'}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-semibold hover:bg-forest-800 transition-colors"
              >
                {language === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Clear All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-forest-700">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
