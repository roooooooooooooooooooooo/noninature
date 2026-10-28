'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/context';
import { useI18n } from '../../lib/i18n/context';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Settings,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, simulateAdmin, logout } = useAuth();
  const { language } = useI18n();

  const navItems = [
    { label_en: 'Dashboard', label_bn: 'ড্যাশবোর্ড', href: '/admin', icon: LayoutDashboard },
    { label_en: 'Products', label_bn: 'পণ্য ব্যবস্থাপনা', href: '/admin/products', icon: Package },
    { label_en: 'Categories', label_bn: 'ক্যাটাগরি', href: '/admin/categories', icon: Layers },
    { label_en: 'Inventory', label_bn: 'স্টক ও ইনভেন্টরি', href: '/admin/inventory', icon: Boxes },
    { label_en: 'Orders', label_bn: 'অর্ডার সমূহ', href: '/admin/orders', icon: ShoppingBag },
    { label_en: 'Customers', label_bn: 'গ্রাহক তালিকা', href: '/admin/customers', icon: Users },
    { label_en: 'Settings', label_bn: 'সাইট ও পেমেন্ট সেটিংস', href: '/admin/settings', icon: Settings },
  ];

  // If not admin, render secure authorization gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'এডমিন এক্সেস সংরক্ষিত' : 'Admin Access Required'}
        </h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70 leading-relaxed">
          {language === 'bn'
            ? 'এই অংশে শুধুমাত্র NoniNature এর অনুমোদিত অ্যাডমিনিস্ট্রেটর বা স্টাফ সদস্য প্রবেশ করতে পারেন।'
            : 'This protected dashboard is restricted to authorized administrators and store staff.'}
        </p>

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => simulateAdmin(true)}
            className="w-full py-3 bg-gold hover:bg-gold-light text-forest-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            {language === 'bn' ? 'এডমিন হিসেবে টেস্ট মোড সক্রিয় করুন' : 'Enable Dev/Demo Admin Access'}
          </button>

          <Link
            href="/login"
            className="w-full py-2.5 bg-forest-900 text-ivory rounded-xl text-xs font-semibold hover:bg-forest-800 transition-colors"
          >
            {language === 'bn' ? 'এডমিন একাউন্টে লগইন করুন' : 'Log in as Admin'}
          </Link>

          <Link
            href="/"
            className="text-xs text-forest-600 hover:text-forest-900 font-medium pt-2"
          >
            {language === 'bn' ? 'ওয়েবসাইটে ফিরে যান' : 'Return to Storefront'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-forest-950 text-ivory flex-shrink-0 flex flex-col justify-between border-r border-forest-900">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-forest-900 flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Admin Logo"
              width={36}
              height={44}
              className="object-contain h-10 w-auto brightness-110"
            />
            <div>
              <h2 className="text-base font-bold font-serif text-ivory tracking-tight">
                Noni<span className="text-leaf-light">Nature</span>
              </h2>
              <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-leaf text-white shadow-md'
                      : 'text-ivory/70 hover:bg-forest-900 hover:text-ivory'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{language === 'bn' ? item.label_bn : item.label_en}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-forest-900 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-ivory/70 hover:bg-forest-900 hover:text-ivory transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ওয়েবসাইটে ফিরুন' : 'Back to Storefront'}</span>
          </Link>

          <button
            type="button"
            onClick={() => simulateAdmin(false)}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-forest-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{language === 'bn' ? 'এডমিন মোড বন্ধ করুন' : 'Exit Admin'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
