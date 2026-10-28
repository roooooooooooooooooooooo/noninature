'use client';

import React from 'react';
import { useI18n } from '../../lib/i18n/context';

export default function ReturnPolicyPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-forest-100 pb-4">
        <h1 className="text-3xl font-bold font-serif text-forest-950">
          {t.returnPolicy}
        </h1>
        <p className="text-xs text-forest-600 mt-1">
          {language === 'bn' ? 'রিটার্ন ও রিফান্ড নীতি' : 'Return & Replacement Guidelines'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-botanicalDark/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '১. রিটার্নের যোগ্যতা' : '1. Eligibility for Returns'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ডেলিভারি ম্যানের সামনে পণ্য চেক করে গ্রহণ করুন। যদি বোতল ভাঙা, লিক বা ভুল পণ্য পৌঁছায়, তবে ডেলিভারি ম্যানের উপস্থিতিতেই তাৎক্ষণিকভাবে রিটার্ন করতে পারবেন।'
              : 'Please inspect your parcel upon arrival. If the container is broken, seal compromised, or incorrect product delivered, return it directly to the courier or contact us immediately.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '২. গাছের চারার প্রতিস্থাপন' : '2. Live Plant Replacement'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ডেলিভারির সময় গাছের ডাল ভেঙে গেলে বা চারা ক্ষতিগ্রস্ত হলে পার্সেল প্রাপ্তির ২৪ ঘণ্টার মধ্যে ছবিসহ আমাদের হটলাইনে বা হোয়াটসঅ্যাপে যোগাযোগ করলে আমরা নতুন চারা প্রতিস্থাপন করব।'
              : 'If a sapling arrives damaged in transit, share clear photos within 24 hours of delivery. We will arrange a free replacement.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '৩. মূল্য ফেরত (Refund)' : '3. Refunds'}
          </h2>
          <p>
            {language === 'bn'
              ? 'অগ্রিম পেমেন্টকৃত অর্ডারের ক্ষেত্রে রিটার্ন অনুমোদিত হলে ৩ থেকে ৫ কর্মদিবসের মধ্যে আপনার বিকাশ/নগদ/ব্যাংক একাউন্টে টাকা রিফান্ড করা হবে।'
              : 'For prepaid orders, approved refunds are transferred to your original bKash/Nagad/Bank account within 3 to 5 business days.'}
          </p>
        </section>
      </div>
    </div>
  );
}
