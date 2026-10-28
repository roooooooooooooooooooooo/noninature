'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../lib/i18n/context';
import { useCart } from '../../lib/cart/context';
import { useAuth } from '../../lib/auth/context';
import { Search, ShoppingBag, Menu, X, User, ShieldAlert, Sparkles } from 'lucide-react';

export default function Header() {
  const { t, language } = useI18n();
  const { totalItems, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t.home, href: '/' },
    { label: t.shop, href: '/shop' },
    { label: t.about, href: '/about' },
    { label: t.noniBenefits, href: '/noni-benefits' },
    { label: t.contact, href: '/contact' },
    { label: t.trackOrder, href: '/track-order' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative h-14 w-12 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="NoniNature Logo"
                width={48}
                height={56}
                className="object-contain h-14 w-auto drop-shadow-sm group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-forest-900 group-hover:text-forest-700 font-serif">
                Noni<span className="text-leaf">Nature</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-forest-600 font-medium">
                {language === 'bn' ? 'প্রাকৃতিক বোটানিক্যাল পণ্য' : 'Botanical Wellness'}
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-forest-50/60 border border-forest-200/80 rounded-full pl-4 pr-10 py-2 text-sm text-botanicalDark placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-leaf focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 p-1.5 text-forest-600 hover:text-forest-900 transition-colors"
              aria-label={t.search}
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-botanicalDark/80 hover:text-forest-900 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-leaf hover:after:w-full after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Admin Badge/Link if Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold/15 text-gold-dark border border-gold/40 hover:bg-gold/25 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.adminDashboard}</span>
              </Link>
            )}

            {/* Account Icon */}
            <Link
              href={user ? '/account' : '/login'}
              className="p-2 text-botanicalDark/80 hover:text-forest-900 rounded-full hover:bg-forest-50 transition-colors"
              title={user ? t.account : t.login}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 bg-forest-50 hover:bg-forest-100/80 text-forest-900 rounded-full transition-all border border-forest-200/60 shadow-sm"
              aria-label={t.cart}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-leaf text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-botanicalDark rounded-md hover:bg-forest-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-forest-50/70 border border-forest-200 rounded-full pl-4 pr-10 py-1.5 text-sm text-botanicalDark placeholder-forest-400 focus:outline-none focus:ring-2 focus:ring-leaf"
            />
            <button
              type="submit"
              className="absolute right-2 p-1 text-forest-600 hover:text-forest-900"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-forest-100 bg-white px-4 py-5 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-botanicalDark hover:text-forest-900 hover:bg-forest-50 px-3 py-2 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-semibold text-gold-dark bg-gold/10 px-3 py-2 rounded-md"
              >
                <ShieldAlert className="w-4 h-4" />
                {t.adminDashboard}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
