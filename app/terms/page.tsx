'use client';

import React from 'react';
import { useI18n } from '../../lib/i18n/context';

export default function TermsPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-forest-100 pb-4">
        <h1 className="text-3xl font-bold font-serif text-forest-950">
          {t.termsConditions}
        </h1>
        <p className="text-xs text-forest-600 mt-1">
          {language === 'bn' ? 'কার্যকর তারিখ: অক্টোবর ২০২৬' : 'Effective: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-botanicalDark/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '১. সেবার শর্তাবলী' : '1. Terms of Service'}
          </h2>
          <p>
            {language === 'bn'
              ? 'NoniNature প্ল্যাটফর্ম ব্যবহারের মাধ্যমে আপনি আমাদের সকল নিয়ম ও শর্ত মেনে নিচ্ছেন। সকল পণ্যের মূল্য বাংলাদেশি টাকায় (৳ BDT) নির্ধারিত এবং পরিবর্তনশীল।'
              : 'By using the NoniNature website and placing an order, you agree to our terms. All prices are stated in Bangladeshi Taka (BDT / ৳) and subject to availability.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '২. অর্ডার নিশ্চিতকরণ ও অসদুপায় রোধ' : '2. Order Confirmation & Anti-Abuse'}
          </h2>
          <p>
            {language === 'bn'
              ? 'ভুয়া বা উদ্দেশ্যপ্রণোদিত অর্ডার প্রতিরোধে আমরা ফোন কল বা এসএমএসের মাধ্যমে গ্রাহকের সত্যতা যাচাইয়ের অধিকার সংরক্ষণ করি। বারবার ভুয়া অর্ডারকারী নম্বর সিস্টেম দ্বারা ব্লক করা হতে পারে।'
              : 'To prevent fraudulent orders, NoniNature reserves the right to verify contact phone numbers prior to shipment. Repeated invalid submissions are flagged for administrative review.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '৩. স্বাস্থ্য বিষয়ক অস্বীকৃতি' : '3. Dietary Product Disclaimer'}
          </h2>
          <p>
            {language === 'bn'
              ? 'আমাদের নোনি পণ্যসমূহ সম্পূর্ণ কৃষিজাত খাদ্য সম্পূরক। এগুলো কোনো প্রেসক্রিপশন ওষুধের বিকল্প হিসেবে ব্যবহৃত হবে না।'
              : 'Our noni products are pure agricultural dietary food supplements and must not replace professional prescription medical healthcare.'}
          </p>
        </section>
      </div>
    </div>
  );
}
