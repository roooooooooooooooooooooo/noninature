'use client';

import React from 'react';
import { useI18n } from '../../lib/i18n/context';

export default function PrivacyPolicyPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-forest-100 pb-4">
        <h1 className="text-3xl font-bold font-serif text-forest-950">
          {t.privacyPolicy}
        </h1>
        <p className="text-xs text-forest-600 mt-1">
          {language === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last Updated: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-botanicalDark/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '১. তথ্য সংগ্রহ ও ব্যবহার' : '1. Information Collection & Usage'}
          </h2>
          <p>
            {language === 'bn'
              ? 'NoniNature এ গ্রাহকদের নাম, ঠিকানা, ও মোবাইল নম্বর কেবলমাত্র অর্ডার প্রক্রিয়াকরণ ও হোম ডেলিভারি সম্পন্ন করার উদ্দেশ্যে সংরক্ষিত হয়। আমরা কখনো কোনো সংবেদনশীল আর্থিক পাসওয়ার্ড বা ওটিপি সংগ্রহ বা সংরক্ষণ করি না।'
              : 'At NoniNature, customer contact information (Name, Phone number, Delivery address) is strictly collected for parcel fulfillment and order verification. We never collect or store banking PINs, OTPs, or financial secrets.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '২. গোপনীয়তা ও তৃতীয় পক্ষ' : '2. Third-Party Sharing & Confidentiality'}
          </h2>
          <p>
            {language === 'bn'
              ? 'গ্রাহকের অনুমতি ব্যতীত কোনো তথ্য বাণিজ্যিক উদ্দেশ্যে কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না। শুধুমাত্র ডেলিভারি কুরিয়ারের কাছে পার্সেল পৌঁছানোর জন্য প্রয়োজনীয় নাম ও ফোন নম্বর প্রদান করা হয়।'
              : 'Customer records are never sold or shared with third-party commercial marketing entities. Basic contact info is only provided to authorized delivery logistics partners to reach your destination.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '৩. গেস্ট চেকআউট ও তথ্য সুরক্ষা' : '3. Guest Checkout & Data Protection'}
          </h2>
          <p>
            {language === 'bn'
              ? 'গেস্ট চেকআউটের মাধ্যমে অর্ডারকৃত তথ্যাবলীও এনক্রিপ্ট করা ডাটাবেসে সুরক্ষিত রাখা হয়। অর্ডার ট্র্যাকিংয়ের ক্ষেত্রে ফোন নম্বর ও অর্ডার রেফারেন্সের দ্বিমুখী যাচাই বাধ্যতামূলক।'
              : 'Guest orders are safeguarded with strict database Row-Level Security. Order tracking requires two-factor challenge verification (Reference + Phone) to prevent unauthorized enumeration.'}
          </p>
        </section>
      </div>
    </div>
  );
}
