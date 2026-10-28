'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { mockSiteSettings } from '../../lib/mock-data';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CreditCard,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const { t, language } = useI18n();
  const settings = mockSiteSettings.general_settings;
  const socials = mockSiteSettings.social_links;

  return (
    <footer className="bg-forest-950 text-ivory/80 pt-16 pb-8 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-forest-800/80">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-900 rounded-xl text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory text-base">
                {language === 'bn' ? '১০০% বিশুদ্ধ ও অর্গানিক' : '100% Organic & Pure'}
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                {language === 'bn' ? 'নিজস্ব খামার থেকে সংগৃহীত নির্ভেজাল নোনি পণ্য।' : 'Pesticide-free raw botanical products.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-900 rounded-xl text-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory text-base">
                {language === 'bn' ? 'সারাদেশে হোম ডেলিভারি' : 'Nationwide Delivery'}
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                {language === 'bn' ? 'ঢাকা ও দেশের প্রতিটি জেলায় নির্ভরযোগ্য ডেলিভারি।' : 'Fast delivery across all 64 districts.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-900 rounded-xl text-gold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory text-base">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি ও মোবাইল ব্যাংকিং' : 'COD & Mobile Banking'}
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                {language === 'bn' ? 'হাতে পেয়ে মূল্য পরিশোধ অথবা বিকাশ ও নগদে পেমেন্ট।' : 'Cash on delivery, bKash, Nagad & Rocket.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-900 rounded-xl text-gold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory text-base">
                {language === 'bn' ? 'বিশেষজ্ঞ পরামর্শ সহায়তা' : 'Botanical Guidance'}
              </h4>
              <p className="text-xs text-ivory/70 mt-1">
                {language === 'bn' ? 'নোনি সেবন ও চারা রোপণের সঠিক নিয়মাবলী।' : 'Consultation on consumption & tree planting.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-forest-800/80 text-sm">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="NoniNature Logo"
                width={40}
                height={48}
                className="object-contain h-12 w-auto brightness-110"
              />
              <span className="text-2xl font-bold text-ivory font-serif tracking-tight">
                Noni<span className="text-leaf-light">Nature</span>
              </span>
            </div>
            <p className="text-ivory/70 leading-relaxed text-xs sm:text-sm max-w-sm">
              {language === 'bn' ? settings.tagline_bn : settings.tagline_en}
            </p>
            <div className="space-y-2 text-xs text-ivory/80 pt-2">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{language === 'bn' ? settings.office_address_bn : settings.office_address_en}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings.contact_phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{settings.contact_email}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-semibold text-ivory tracking-wide uppercase text-xs">
              {t.quickLinks}
            </h5>
            <ul className="space-y-2 text-xs text-ivory/70">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">{t.home}</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">{t.shop}</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">{t.about}</Link>
              </li>
              <li>
                <Link href="/noni-benefits" className="hover:text-gold transition-colors">{t.noniBenefits}</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors">{t.trackOrder}</Link>
              </li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div className="space-y-3">
            <h5 className="font-semibold text-ivory tracking-wide uppercase text-xs">
              {t.policies}
            </h5>
            <ul className="space-y-2 text-xs text-ivory/70">
              <li>
                <Link href="/shipping-policy" className="hover:text-gold transition-colors">{t.shippingPolicy}</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-gold transition-colors">{t.returnPolicy}</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">{t.privacyPolicy}</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">{t.termsConditions}</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">{t.contact}</Link>
              </li>
            </ul>
          </div>

          {/* Payment & Social */}
          <div className="space-y-4">
            <h5 className="font-semibold text-ivory tracking-wide uppercase text-xs">
              {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Methods'}
            </h5>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-forest-900 border border-forest-800 rounded font-medium text-ivory">Cash on Delivery</span>
              <span className="px-2.5 py-1 bg-pink-900/60 border border-pink-700/50 rounded font-medium text-pink-200">bKash</span>
              <span className="px-2.5 py-1 bg-orange-900/60 border border-orange-700/50 rounded font-medium text-orange-200">Nagad</span>
              <span className="px-2.5 py-1 bg-purple-900/60 border border-purple-700/50 rounded font-medium text-purple-200">Rocket</span>
              <span className="px-2.5 py-1 bg-blue-900/60 border border-blue-700/50 rounded font-medium text-blue-200">Bank Transfer</span>
            </div>

            <div className="pt-2">
              <h5 className="font-semibold text-ivory tracking-wide uppercase text-xs mb-2">
                {language === 'bn' ? 'সোশ্যাল মিডিয়া' : 'Connect With Us'}
              </h5>
              <div className="flex items-center gap-3">
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center hover:bg-forest-800 text-ivory transition-colors text-xs font-bold"
                >
                  FB
                </a>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center hover:bg-forest-800 text-ivory transition-colors text-xs font-bold"
                >
                  YT
                </a>
                <a
                  href={`https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center hover:bg-forest-800 text-green-400 transition-colors text-xs font-bold"
                >
                  WA
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} NoniNature Bangladesh. {t.allRightsReserved}</p>
          <p className="text-[11px] text-ivory/40">
            {language === 'bn'
              ? 'মরিন্ডা সাইট্রিফোলিয়া (নোনি) প্রাকৃতিক খাদ্য সম্পূরক ও ভেষজ পণ্য।'
              : 'Morinda Citrifolia natural dietary botanical products.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
