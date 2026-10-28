'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductCard from '../components/product/ProductCard';
import { useI18n } from '../lib/i18n/context';
import { mockCategories, mockProducts } from '../lib/mock-data';
import { ArrowRight, Leaf, Shield, Sparkles, HeartPulse, Award, Sprout } from 'lucide-react';

export default function HomePage() {
  const { t, language } = useI18n();

  const featuredProducts = mockProducts.filter((p) => p.is_featured);
  const latestProducts = [...mockProducts].reverse();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Botanical Hero Carousel */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* 2. Shop By Category */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-leaf uppercase">
              {language === 'bn' ? 'প্রকৃতির উপহার' : 'Natures Bounty'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
              {t.shopByCategory}
            </h2>
            <p className="text-sm text-botanicalDark/70">
              {language === 'bn'
                ? 'কাঁচা ও প্রক্রিয়াজাত নোনি জুস থেকে শুরু করে কলম চারা গাছ—সব পাবেন আমাদের সংগ্রহে।'
                : 'From pure aged noni juice to vigorous grafted saplings for home planting.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative rounded-2xl bg-white border border-forest-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-forest-300 transition-all duration-300"
              >
                <div className="w-28 h-28 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center justify-center p-2 mb-4 group-hover:scale-105 transition-transform overflow-hidden relative shadow-inner">
                  <Image
                    src={category.image_url || '/images/logo.png'}
                    alt={category.name_en}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <h3 className="font-bold text-base text-forest-950 group-hover:text-leaf transition-colors mb-1">
                  {language === 'bn' ? category.name_bn : category.name_en}
                </h3>
                <p className="text-xs text-botanicalDark/60 line-clamp-2 mb-4 leading-relaxed">
                  {language === 'bn' ? category.description_bn : category.description_en}
                </p>
                <span className="inline-flex items-center text-xs font-semibold text-leaf group-hover:translate-x-1 transition-transform mt-auto">
                  <span>{t.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest-100 pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-leaf uppercase">
                {language === 'bn' ? 'সেরা পছন্দ' : 'Top Recommendations'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
                {t.featuredProducts}
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:text-forest-900 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Brand Story & Agricultural Sourcing Section */}
        <section className="relative rounded-3xl bg-forest-900 text-ivory p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-gold text-xs font-semibold border border-forest-700">
                <Sprout className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আমাদের খামার ও ঐতিহ্য' : 'Our Organic Farm'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-ivory leading-tight">
                {t.sourceStoryTitle}
              </h2>

              <p className="text-ivory/80 text-sm sm:text-base leading-relaxed font-light">
                {t.sourceStoryDesc}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-forest-800/80">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-gold block font-serif">১০০%</span>
                  <span className="text-xs text-ivory/70">
                    {language === 'bn' ? 'প্রাকৃতিক জৈব সার' : 'Organic Manure'}
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-gold block font-serif">০%</span>
                  <span className="text-xs text-ivory/70">
                    {language === 'bn' ? 'কীটনাশক ও রাসায়নিক' : 'Harmful Chemicals'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gold block font-serif">৬৪</span>
                  <span className="text-xs text-ivory/70">
                    {language === 'bn' ? 'জেলায় ডেলিভারি' : 'Districts Delivered'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold hover:bg-gold-light text-forest-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                >
                  <span>{t.learnMore}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl bg-forest-800/60 border border-forest-700/60 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-xl">
                <div className="relative w-40 h-40 mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Botanical Noni"
                    width={160}
                    height={160}
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <h4 className="font-serif font-bold text-lg text-ivory">Morinda Citrifolia</h4>
                <p className="text-xs text-gold mt-1">
                  {language === 'bn' ? 'সুস্থ জীবনের প্রাকৃতিক সহচর' : 'Pure Botanical Vitality'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Non-Medical Botanical Benefits Overview */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-leaf uppercase">
              {language === 'bn' ? 'পুষ্টি ও সুস্বাস্থ্যের গুণাবলী' : 'Botanical Nutrients'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
              {language === 'bn' ? 'নোনি ফলের সমৃদ্ধ পুষ্টি উপাদান' : 'Nutritional Power of Noni Fruit'}
            </h2>
            <p className="text-xs sm:text-sm text-botanicalDark/70">
              {language === 'bn'
                ? 'নোনি (Morinda Citrifolia) বহু শতাব্দী ধরে প্রাকৃতিকভাবে ভিটামিন সি, বায়োফ্ল্যাভনয়েড ও অ্যান্টিঅক্সিডেন্টের প্রাকৃতিক উৎস হিসেবে পরিচিত।'
                : 'Scientific botanical research identifies noni as a rich dietary source of Vitamin C, potassium, and iridoid antioxidants.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-50 text-leaf flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-forest-950 text-base">
                {language === 'bn' ? 'উচ্চমাত্রার অ্যান্টিঅক্সিডেন্ট' : 'Antioxidant Support'}
              </h3>
              <p className="text-xs text-botanicalDark/70 leading-relaxed">
                {language === 'bn'
                  ? 'নোনি ফলে রয়েছে অনন্য ইরিডয়েড (Iridoids) যৌগ যা অক্সিডেটিভ স্ট্রেস কমাতে ও কোষকে সুরক্ষা দিতে সহায়তা করে।'
                  : 'Noni fruit contains rich iridoid polyphenols that help fight cellular oxidative stress and protect healthy tissues.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-50 text-leaf flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-forest-950 text-base">
                {language === 'bn' ? 'প্রাকৃতিক কর্মক্ষমতা ও সতেজতা' : 'Energy & Vitality'}
              </h3>
              <p className="text-xs text-botanicalDark/70 leading-relaxed">
                {language === 'bn'
                  ? 'ক্লান্তি দূর করে সারাদিন সতেজ থাকতে ও প্রাকৃতিক শক্তি জোগাতে প্রতিদিনের ডায়েটে নোনি জুস বিশেষ উপযোগী।'
                  : 'Naturally supports physical endurance, reduces daily fatigue, and promotes holistic wellness without stimulants.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-50 text-leaf flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-forest-950 text-base">
                {language === 'bn' ? 'ত্বকের যত্ন ও কোমলতা' : 'Skin & Hair Nourishment'}
              </h3>
              <p className="text-xs text-botanicalDark/70 leading-relaxed">
                {language === 'bn'
                  ? 'প্রাকৃতিক ভিটামিন ও ফ্যাটি অ্যাসিড সমৃদ্ধ হওয়ায় ত্বককে ভেতর থেকে আর্দ্র ও দীপ্তিময় রাখতে ভূমিকা রাখে।'
                  : 'Rich in essential fatty acids and nutrients that nourish skin elasticity and promote a healthy natural glow.'}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Latest Arrivals */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest-100 pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-leaf uppercase">
                {language === 'bn' ? 'নতুন সংযোজন' : 'Fresh Harvest'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
                {t.latestProducts}
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:text-forest-900 transition-colors"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
