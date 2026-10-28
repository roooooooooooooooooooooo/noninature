'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../../components/product/ProductCard';
import { useI18n } from '../../../lib/i18n/context';
import { mockCategories, mockProducts } from '../../../lib/mock-data';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, t } = useI18n();

  const category = mockCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'ক্যাটাগরি পাওয়া যায়নি' : 'Category Not Found'}
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.continueShopping}</span>
        </Link>
      </div>
    );
  }

  const categoryProducts = mockProducts.filter((p) => p.category_id === category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-forest-700">
        <Link href="/" className="hover:text-forest-900">{t.home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-forest-900">{t.shop}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-forest-950">
          {language === 'bn' ? category.name_bn : category.name_en}
        </span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-forest-900 text-ivory p-8 sm:p-12 overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            {language === 'bn' ? 'বোটানিক্যাল সংগ্রহ' : 'Botanical Collection'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-ivory">
            {language === 'bn' ? category.name_bn : category.name_en}
          </h1>
          <p className="text-sm text-ivory/80 leading-relaxed font-light">
            {language === 'bn' ? category.description_bn : category.description_en}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-forest-100 pb-4">
          <h2 className="text-xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'এই ক্যাটাগরির পণ্যসমূহ' : 'Products in this Category'}
          </h2>
          <span className="text-xs text-forest-600 font-medium">
            {categoryProducts.length} {language === 'bn' ? 'টি পণ্য' : 'products'}
          </span>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-forest-100 p-12 text-center space-y-3">
            <p className="text-sm text-botanicalDark/70">
              {language === 'bn'
                ? 'এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য উপলব্ধ নেই।'
                : 'No products currently available in this category.'}
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2 rounded-full bg-forest-900 text-ivory text-xs font-semibold"
            >
              {t.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
