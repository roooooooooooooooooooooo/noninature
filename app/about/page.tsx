'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { Sprout, ShieldCheck, Heart, Award, Sparkles, MapPin } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf">
          {language === 'bn' ? 'আমাদের গল্প ও দর্শন' : 'Our Story & Mission'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-forest-950">
          {t.about}
        </h1>
        <p className="text-sm text-botanicalDark/70 max-w-xl mx-auto leading-relaxed">
          {language === 'bn'
            ? 'মরিন্ডা সাইট্রিফোলিয়া (নোনি) ফলের প্রাকৃতিক গুণাগুণ সবার মাঝে পৌঁছে দিতে আমরা বদ্ধপরিকর।'
            : 'Bridging pure botanical heritage with sustainable organic agro-farming in Bangladesh.'}
        </p>
      </div>

      {/* Farm Story Hero Image */}
      <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-xl border border-forest-100 group">
        <Image
          src="/images/about/farm-story.webp"
          alt="NoniNature Farm Story"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent flex items-end p-6 sm:p-8">
          <div className="text-ivory space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              {language === 'bn' ? 'শতভাগ নিজস্ব জৈব খামার' : '100% Organic Botanical Orchard'}
            </span>
            <p className="text-base sm:text-lg font-serif font-bold">
              {language === 'bn' ? 'প্রাকৃতিক চাষাবাদ থেকে আপনার টেবিলে খাঁটি নোনি' : 'Pure Morinda Citrifolia Harvested with Care'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Story Hero */}
      <div className="bg-white rounded-3xl border border-forest-100 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-forest-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 p-2 flex items-center justify-center flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="NoniNature"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-forest-950">
              Noni<span className="text-leaf">Nature</span> Agro Enterprise
            </h2>
            <p className="text-xs text-forest-600 font-medium">
              {language === 'bn' ? 'প্রাকৃতিক নোনি চাষ ও পণ্য প্রস্তুতকারক' : 'Organic Cultivation & Botanical Products'}
            </p>
          </div>
        </div>

        <div className="prose text-botanicalDark/80 leading-relaxed text-sm space-y-4">
          <p>
            {language === 'bn'
              ? 'নোনি নেচার প্রতিষ্ঠিত হয়েছে বাংলাদেশের মাটিতে মরিন্ডা সাইট্রিফোলিয়া (Morinda citrifolia) চাষ সম্প্রসারণ ও এর প্রাকৃতিক সুফল প্রতিটি ঘরে পৌঁছে দেওয়ার অঙ্গীকার নিয়ে। আমরা কোনো প্রকার কৃত্রিম হরমোন বা ক্ষতিকর রাসায়নিক কীটনাশক ব্যবহার না করে সম্পূর্ণ জৈব উপায়ে নোনি বাগান পরিচর্যা করি।'
              : 'NoniNature was established to promote chemical-free organic farming of Morinda citrifolia in Bangladesh. Our mission is to provide unadulterated, aged pure noni juice, vigorously grown grafted saplings, sun-dried fruit, and botanical herbal care products directly from our orchards to conscious consumers.'}
          </p>

          <p>
            {language === 'bn'
              ? 'আমাদের সংগৃহীত প্রতিটি ফল পরিপক্ব হওয়ার পর স্বাস্থ্যসম্মত আধুনিক কোল্ড-প্রসেস পদ্ধতিতে নিষ্কাশন ও প্রক্রিয়াজাত করা হয়। ফলে নোনির প্রাকৃতিক ভিটামিন, এনজাইম ও অ্যান্টিঅক্সিডেন্ট অক্ষুণ্ণ থাকে।'
              : 'Every noni fruit is harvested at peak botanical maturity and processed using gentle cold-press extraction and traditional aging methods, preserving natural enzymes, polyphenols, and micronutrients.'}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-forest-100">
          <div className="p-4 bg-forest-50/60 rounded-2xl space-y-2">
            <Sprout className="w-5 h-5 text-leaf" />
            <h4 className="font-bold text-xs text-forest-950 uppercase tracking-wide">
              {language === 'bn' ? '১০০% দেশীয় চাষ' : '100% Local Agro'}
            </h4>
            <p className="text-[11px] text-botanicalDark/70">
              {language === 'bn'
                ? 'বাংলাদেশের জলবায়ুতে অনুকূল উন্নত জাতের চারা ও নিজস্ব বাগান।'
                : 'Pesticide-free agro orchards acclimatized to Bangladesh soils.'}
            </p>
          </div>

          <div className="p-4 bg-forest-50/60 rounded-2xl space-y-2">
            <ShieldCheck className="w-5 h-5 text-leaf" />
            <h4 className="font-bold text-xs text-forest-950 uppercase tracking-wide">
              {language === 'bn' ? 'কোনো প্রিজারভেটিভ নেই' : 'Zero Additives'}
            </h4>
            <p className="text-[11px] text-botanicalDark/70">
              {language === 'bn'
                ? 'কৃত্রিম চিনি, রঙ বা ফ্লেভারমুক্ত খাঁটি গুণাগুণ।'
                : 'No synthetic colors, added sugar, or chemical preservatives.'}
            </p>
          </div>

          <div className="p-4 bg-forest-50/60 rounded-2xl space-y-2">
            <Award className="w-5 h-5 text-leaf" />
            <h4 className="font-bold text-xs text-forest-950 uppercase tracking-wide">
              {language === 'bn' ? 'সরাসরি কৃষক সেবা' : 'Agro Community'}
            </h4>
            <p className="text-[11px] text-botanicalDark/70">
              {language === 'bn'
                ? 'ছাদবাগান ও বাণিজ্যিক নোনি চাষীদের সার্বক্ষণিক কারিগরি সহায়তা।'
                : 'Horticultural guidance for rooftop gardeners and tree growers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
