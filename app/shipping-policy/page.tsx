'use client';

import React from 'react';
import { useI18n } from '../../lib/i18n/context';

export default function ShippingPolicyPage() {
  const { language, t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-forest-100 pb-4">
        <h1 className="text-3xl font-bold font-serif text-forest-950">
          {t.shippingPolicy}
        </h1>
        <p className="text-xs text-forest-600 mt-1">
          {language === 'bn' ? 'ডেলিভারি সময় ও চার্জ সংক্রান্ত নির্দেশাবলী' : 'Shipping guidelines & delivery timelines'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-8 shadow-sm space-y-6 text-xs sm:text-sm text-botanicalDark/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '১. ডেলিভারি এলাকা ও খরচ' : '1. Coverage & Delivery Charges'}
          </h2>
          <p>
            {language === 'bn'
              ? 'আমরা সমগ্র বাংলাদেশের ৬৪টি জেলায় দ্রুত ডেলিভারি প্রদান করি। ঢাকার ভেতরে স্ট্যান্ডার্ড ডেলিভারি চার্জ ৳৭০ এবং ঢাকার বাইরে জেলাভেদে ৳১১০ - ৳১৩০।'
              : 'We deliver nationwide across all 64 districts in Bangladesh. Standard delivery is ৳70 inside Dhaka and ৳110-৳130 for regional districts.'}
          </p>
          <div className="p-3 bg-forest-50 rounded-xl text-forest-900 font-semibold text-xs">
            {language === 'bn'
              ? '🌿 বিশেষ অফার: ২,০০০ টাকার বেশি অর্ডারে সারাদেশে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!'
              : '🌿 Free Delivery Offer: Free delivery across Bangladesh on orders of ৳2,000 or more!'}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '২. সম্ভাব্য ডেলিভারি সময়' : '2. Estimated Delivery Time'}
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>{language === 'bn' ? 'ঢাকার ভেতরে: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে।' : 'Inside Dhaka: 24 to 48 hours.'}</li>
            <li>{language === 'bn' ? 'ঢাকার বাইরে ও জেলা সদর: ২ থেকে ৪ কর্মদিবস।' : 'Outside Dhaka & District towns: 2 to 4 working days.'}</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950 font-serif">
            {language === 'bn' ? '৩. গাছের চারা প্যাকেজিং' : '3. Live Seedling Packaging'}
          </h2>
          <p>
            {language === 'bn'
              ? 'জীবন্ত নোনি চারা গাছ বিশেষ কার্টন ও আর্দ্রতা-সুরক্ষিত পলিথিন মোড়কে প্রেরণ করা হয় যেন দীর্ঘ যাত্রায় গাছের কোনো ক্ষতি না হয়।'
              : 'Living saplings are packaged in moisture-retaining nursery wraps and rigid ventilated cartons to protect root systems during transit.'}
          </p>
        </section>
      </div>
    </div>
  );
}
