'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';
import { useI18n } from '../../lib/i18n/context';
import { User, Package, LogOut, ShieldAlert, Phone, Mail, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, role, isAdmin, logout } = useAuth();
  const { language, t } = useI18n();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-forest-950">{t.account}</h1>
          <p className="text-xs sm:text-sm text-botanicalDark/70 mt-1">
            {language === 'bn'
              ? 'আপনার প্রোফাইল ও অর্ডার হিস্টোরি পরিচালনা করুন'
              : 'Manage your profile and track past orders'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-forest-100 p-6 space-y-4 shadow-sm md:col-span-1">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center font-bold text-xl font-serif">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'G'}
          </div>

          <div>
            <h3 className="font-bold text-base text-forest-950">
              {user?.full_name || (language === 'bn' ? 'গেস্ট কাস্টমার' : 'Guest Customer')}
            </h3>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
              {role}
            </span>
          </div>

          <div className="space-y-2 text-xs text-botanicalDark/80 pt-2 border-t border-forest-100">
            {user?.email && (
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-forest-400" />
                <span className="truncate">{user.email}</span>
              </p>
            )}
            {user?.phone && (
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-forest-400" />
                <span>{user.phone}</span>
              </p>
            )}
          </div>

          {isAdmin && (
            <div className="pt-2">
              <Link
                href="/admin"
                className="w-full py-2.5 px-4 bg-gold hover:bg-gold-light text-forest-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.adminDashboard}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions & Orders Shortcut */}
        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold font-serif text-lg text-forest-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-leaf" />
              <span>{language === 'bn' ? 'আপনার অর্ডার সমূহ' : 'Your Orders'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-botanicalDark/70 leading-relaxed">
              {language === 'bn'
                ? 'আপনার পূর্বে দেওয়া সমস্ত অর্ডারের বিবরণ, ডেলিভারি স্ট্যাটাস ও ইনভয়েস দেখতে নিচের বোতামে চাপ দিন।'
                : 'View your order details, live status tracking, and invoices.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/account/orders"
              className="px-6 py-3 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>{language === 'bn' ? 'সব অর্ডার দেখুন' : 'View All Orders'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/track-order"
              className="px-6 py-3 bg-forest-50 hover:bg-forest-100 text-forest-900 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors border border-forest-200"
            >
              {t.trackOrder}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
