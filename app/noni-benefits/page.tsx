'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { ShieldCheck, HeartPulse, Sparkles, Sprout, ArrowRight, Info } from 'lucide-react';

export default function NoniBenefitsPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf">
          {language === 'bn' ? 'উদ্ভিদজাত পুষ্টি ও বিজ্ঞান' : 'Botanical Science & Nutrition'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-forest-950">
          {t.noniBenefits}
        </h1>
        <p className="text-sm text-botanicalDark/70 max-w-xl mx-auto leading-relaxed">
          {language === 'bn'
            ? 'মরিন্ডা সাইট্রিফোলিয়া (নোনি) ফলের প্রাকৃতিক পুষ্টি উপাদান ও দৈনন্দিন খাদ্যতালিকায় এর ভূমিকা।'
            : 'Exploring the natural antioxidants, phytonutrients, and botanical heritage of Morinda citrifolia.'}
        </p>
      </div>

      {/* Scientific Botanical Cross-Section Hero */}
      <div className="relative h-64 sm:h-84 w-full rounded-3xl overflow-hidden shadow-xl border border-forest-100 group">
        <Image
          src="/images/benefits/noni-cross-section.webp"
          alt="Morinda Citrifolia Botanical Science"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/30 to-transparent flex items-end p-6 sm:p-8">
          <div className="text-ivory space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              {language === 'bn' ? 'মরিন্ডা সাইট্রিফোলিয়া পরিচিতি' : 'Morinda Citrifolia Botanical Anatomy'}
            </span>
            <p className="text-base sm:text-lg font-serif font-bold">
              {language === 'bn' ? 'প্রাকৃতিক ফাইটোনিউট্রিয়েন্ট ও ইরিডয়েড সমৃদ্ধ বোটানিক্যাল বিস্ময়' : 'Ancient Tropical Botanical Rich in Phytonutrients & Enzymes'}
            </p>
          </div>
        </div>
      </div>

      {/* Non-Medical Disclaimer Alert */}
      <div className="p-4 bg-forest-50 border border-forest-200 rounded-2xl flex items-start gap-3 text-xs text-forest-800">
        <Info className="w-5 h-5 text-leaf flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {language === 'bn'
            ? 'সতর্কীকরণ ও ঘোষণা: নোনি ফল এবং এর জুস একটি প্রাকৃতিক খাদ্য সম্পূরক (Dietary Supplement)। এটি কোনো ওষুধ নয় এবং কোনো রোগ নিরাময়ের দাবি করে না। গুরুতর স্বাস্থ্য সমস্যায় সর্বদা চিকিৎসকের পরামর্শ গ্রহণ করুন।'
            : 'Botanical Disclaimer: Noni products are natural nutritional and dietary supplements. They are not intended to diagnose, treat, cure, or replace professional medical healthcare.'}
        </p>
      </div>

      {/* Key Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-leaf flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-forest-950">
            {language === 'bn' ? '১. ইরিডয়েড ও অ্যান্টিঅক্সিডেন্ট' : '1. Rich in Iridoids & Polyphenols'}
          </h3>
          <p className="text-xs text-botanicalDark/75 leading-relaxed">
            {language === 'bn'
              ? 'নোনি ফলের অন্যতম প্রধান উপাদান হলো এর ইরিডয়েড (Iridoids)। সাধারণ অ্যান্টিঅক্সিডেন্ট ভিটামিনের তুলনায় ইরিডয়েড স্থিতিশীল এবং শরীরে ফ্রি রেডিক্যাল কমাতে কার্যকর ভূমিকা রাখে।'
              : 'Unlike many common fruits, noni contains stable iridoid compounds along with flavonoids, providing sustained cellular antioxidant defense.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-leaf flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-forest-950">
            {language === 'bn' ? '২. প্রাকৃতিক কর্মক্ষমতা ও ক্লান্তি দূরীকরণ' : '2. Energy & Physical Vitality'}
          </h3>
          <p className="text-xs text-botanicalDark/75 leading-relaxed">
            {language === 'bn'
              ? 'নিয়মিত পরিমিত মাত্রায় নোনি জুস সেবন পেশির শক্তি ও সহনশীলতা বৃদ্ধিতে সহায়তা করে। ক্যাফেইন ছাড়াই প্রাকৃতিকভাবে সতেজতা অনুভব করা যায়।'
              : 'Studies in exercise nutrition suggest noni juice helps support physical endurance and healthy recovery from daily fatigue without stimulant crashes.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-leaf flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-forest-950">
            {language === 'bn' ? '৩. ভিটামিন সি ও রোগ প্রতিরোধ' : '3. Vitamin C & Immunity Support'}
          </h3>
          <p className="text-xs text-botanicalDark/75 leading-relaxed">
            {language === 'bn'
              ? 'প্রাকৃতিক ভিটামিন সি ও পটাসিয়ামের একটি চমৎকার উৎস, যা রোগ প্রতিরোধ ব্যবস্থার প্রাকৃতিক ছন্দ ঠিক রাখতে সহায়তা করে।'
              : 'A rich natural source of dietary Vitamin C, potassium, and amino acids that support the immune system and daily metabolic balance.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-forest-50 text-leaf flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-forest-950">
            {language === 'bn' ? '৪. সহজ হজম ও অন্ত্রের সুস্থতা' : '4. Digestive & Cellular Harmony'}
          </h3>
          <p className="text-xs text-botanicalDark/75 leading-relaxed">
            {language === 'bn'
              ? 'প্রাকৃতিক উৎসেচক ও দ্রবণীয় ফাইবার হজমপ্রক্রিয়াকে স্বাভাবিক ও সচল রাখতে সহায়তা করে।'
              : 'Natural fruit enzymes and soluble dietary fibers assist normal gastrointestinal function and nutrient assimilation.'}
          </p>
        </div>
      </div>

      {/* Recommended Usage */}
      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold font-serif text-forest-950">
          {language === 'bn' ? 'সেবনবিধি ও নির্দেশিকা' : 'Suggested Consumption Guide'}
        </h3>
        <ul className="space-y-2 text-xs text-botanicalDark/80 list-disc list-inside leading-relaxed">
          <li>
            {language === 'bn'
              ? 'প্রতিদিন সকালে খালি পেটে ৩০ মিলি (প্রায় ২ টেবিল চামচ) খাঁটি নোনি জুস এক গ্লাস কুসুম গরম পানিতে মিশিয়ে পান করুন।'
              : 'Dilute 30ml (approx. 2 tablespoons) of pure noni juice in a glass of lukewarm water each morning before breakfast.'}
          </li>
          <li>
            {language === 'bn'
              ? 'প্রয়োজনে খাঁটি মধু অথবা লেবুর রস মিশিয়ে স্বাদ পরিবর্তন করে নেওয়া যেতে পারে।'
              : 'Natural raw honey or fresh lemon juice may be added according to taste preference.'}
          </li>
          <li>
            {language === 'bn'
              ? 'শুকনা নোনি ফলের টুকরা গরম পানিতে ফুটিয়ে সুস্বাদু ভেষজ নোনি চা হিসেবে উপভোগ করা যায়।'
              : 'Sun-dried slices can be simmered in boiling water for 5 minutes to brew a soothing herbal tea.'}
          </li>
        </ul>

        <div className="pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 text-ivory text-xs font-bold hover:bg-forest-800 transition-all shadow-md"
          >
            <span>{t.shop}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
