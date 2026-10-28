'use client';

import React, { useState } from 'react';
import { useI18n } from '../../../lib/i18n/context';
import { mockSiteSettings, mockDeliveryRules } from '../../../lib/mock-data';
import { Settings, Save, CheckCircle2, Truck, CreditCard, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const { language } = useI18n();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings states
  const [general, setGeneral] = useState(mockSiteSettings.general_settings);
  const [payments, setPayments] = useState(mockSiteSettings.payment_settings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'স্টোর সেটিংস' : 'Store Settings'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'ডেলিভারি চার্জ, মোবাইল ব্যাংকিং নম্বর এবং সাইট তথ্য পরিচালনা'
              : 'Configure shipping rules, manual mobile banking accounts, and store details'}
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. General & Announcement */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-leaf" />
            <span>General Store Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Support Phone *</label>
              <input
                type="text"
                value={general.contact_phone}
                onChange={(e) => setGeneral({ ...general, contact_phone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Support Email *</label>
              <input
                type="email"
                value={general.contact_email}
                onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 uppercase">Announcement Bar (বাংলা)</label>
              <input
                type="text"
                value={general.announcement_bn}
                onChange={(e) => setGeneral({ ...general, announcement_bn: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700 uppercase">Announcement Bar (English)</label>
              <input
                type="text"
                value={general.announcement_en}
                onChange={(e) => setGeneral({ ...general, announcement_en: e.target.value })}
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">Free Shipping Threshold (৳)</label>
              <input
                type="number"
                value={general.free_shipping_threshold}
                onChange={(e) =>
                  setGeneral({ ...general, free_shipping_threshold: Number(e.target.value) })
                }
                className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf font-bold"
              />
            </div>
          </div>
        </div>

        {/* 2. Manual Mobile Banking & Accounts */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-leaf" />
            <span>Mobile Banking Receiving Accounts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* bKash */}
            <div className="p-4 bg-pink-50/50 border border-pink-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-pink-900 text-sm">bKash Send Money</h3>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Receiving Number</label>
                <input
                  type="text"
                  value={payments.bkash_number}
                  onChange={(e) => setPayments({ ...payments, bkash_number: e.target.value })}
                  className="w-full border border-pink-200 rounded-xl p-2 outline-none bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instructions (বাংলা)</label>
                <textarea
                  rows={2}
                  value={payments.bkash_instructions_bn}
                  onChange={(e) =>
                    setPayments({ ...payments, bkash_instructions_bn: e.target.value })
                  }
                  className="w-full border border-pink-200 rounded-xl p-2 outline-none bg-white text-[11px]"
                />
              </div>
            </div>

            {/* Nagad */}
            <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-orange-900 text-sm">Nagad Send Money</h3>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Receiving Number</label>
                <input
                  type="text"
                  value={payments.nagad_number}
                  onChange={(e) => setPayments({ ...payments, nagad_number: e.target.value })}
                  className="w-full border border-orange-200 rounded-xl p-2 outline-none bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instructions (বাংলা)</label>
                <textarea
                  rows={2}
                  value={payments.nagad_instructions_bn}
                  onChange={(e) =>
                    setPayments({ ...payments, nagad_instructions_bn: e.target.value })
                  }
                  className="w-full border border-orange-200 rounded-xl p-2 outline-none bg-white text-[11px]"
                />
              </div>
            </div>

            {/* Rocket */}
            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-purple-900 text-sm">Rocket Send Money</h3>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Receiving Number</label>
                <input
                  type="text"
                  value={payments.rocket_number}
                  onChange={(e) => setPayments({ ...payments, rocket_number: e.target.value })}
                  className="w-full border border-purple-200 rounded-xl p-2 outline-none bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instructions (বাংলা)</label>
                <textarea
                  rows={2}
                  value={payments.rocket_instructions_bn}
                  onChange={(e) =>
                    setPayments({ ...payments, rocket_instructions_bn: e.target.value })
                  }
                  className="w-full border border-purple-200 rounded-xl p-2 outline-none bg-white text-[11px]"
                />
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-blue-900 text-sm">Bank Transfer</h3>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Bank & Account Number</label>
                <input
                  type="text"
                  value={`${payments.bank_name} - ${payments.bank_account_number}`}
                  onChange={(e) =>
                    setPayments({ ...payments, bank_account_number: e.target.value })
                  }
                  className="w-full border border-blue-200 rounded-xl p-2 outline-none bg-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Branch & Instructions</label>
                <input
                  type="text"
                  value={payments.bank_branch}
                  onChange={(e) => setPayments({ ...payments, bank_branch: e.target.value })}
                  className="w-full border border-blue-200 rounded-xl p-2 outline-none bg-white text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-forest-900 hover:bg-forest-800 text-ivory rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
