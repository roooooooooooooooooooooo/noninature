'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/cart/context';
import { useI18n } from '../../lib/i18n/context';
import { formatPrice } from '../../lib/utils/formatters';
import { mockSiteSettings } from '../../lib/mock-data';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { t, language } = useI18n();

  const freeShippingThreshold = mockSiteSettings.general_settings.free_shipping_threshold;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-forest-50 rounded-full mx-auto flex items-center justify-center text-forest-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
          {t.cartEmpty}
        </h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70 max-w-md mx-auto">
          {language === 'bn'
            ? 'আপনার শপিং ব্যাগে এখনও কোনো পণ্য যোগ করেননি। আমাদের খাঁটি অর্গানিক নোনি পণ্যগুলো দেখুন।'
            : 'Your shopping cart is currently empty. Explore our catalog of pure organic noni products.'}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest-900 text-ivory text-sm font-semibold hover:bg-forest-800 transition-all shadow-md"
        >
          <span>{t.continueShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-forest-950">
            {t.shoppingCart}
          </h1>
          <p className="text-xs sm:text-sm text-botanicalDark/70 mt-1">
            {language === 'bn'
              ? `ব্যাগে ${items.length} টি পণ্য রয়েছে`
              : `${items.length} items in your bag`}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>{language === 'bn' ? 'সম্পূর্ণ ব্যাগ খালি করুন' : 'Clear Cart'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items Table/List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="p-4 bg-forest-50/80 rounded-2xl border border-forest-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-forest-900 font-medium">
              <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
              <span>
                {neededForFreeShipping > 0
                  ? language === 'bn'
                    ? `আর ${formatPrice(neededForFreeShipping, 'bn')} টাকার পণ্য কিনলে ফ্রি ডেলিভারি!`
                    : `Add ${formatPrice(neededForFreeShipping, 'en')} more to unlock Free Delivery!`
                  : language === 'bn'
                  ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।'
                  : 'Congratulations! You qualify for Free Delivery.'}
              </span>
            </div>
            <Link href="/shop" className="text-leaf font-bold hover:underline flex-shrink-0">
              {t.continueShopping}
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-forest-100 divide-y divide-forest-100 shadow-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-20 h-20 bg-forest-50 rounded-2xl p-2 flex items-center justify-center flex-shrink-0 border border-forest-100">
                  <Image
                    src={item.image_url || '/images/logo.png'}
                    alt={item.name_en}
                    width={70}
                    height={70}
                    className="object-contain max-h-16 w-auto"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-forest-950">
                    {language === 'bn' ? item.name_bn : item.name_en}
                  </h3>
                  {item.variant_name_en && (
                    <p className="text-xs text-forest-600 font-medium mt-0.5">
                      {language === 'bn' ? item.variant_name_bn : item.variant_name_en}
                    </p>
                  )}
                  <p className="text-xs text-forest-400 font-mono mt-0.5">
                    {t.sku}: {item.sku}
                  </p>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto gap-1">
                  <span className="text-sm font-bold text-forest-900">
                    {formatPrice(item.price, language)}
                  </span>
                  {item.regular_price > item.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.regular_price, language)}
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-forest-200 rounded-xl bg-forest-50/50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 text-forest-700 hover:bg-forest-100 rounded-l-xl"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-forest-950">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    disabled={item.quantity >= item.max_stock}
                    className="p-2 text-forest-700 hover:bg-forest-100 rounded-r-xl disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-bold text-sm text-forest-950 min-w-[70px] text-right">
                  {formatPrice(item.price * item.quantity, language)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="text-lg font-bold font-serif text-forest-950 border-b border-forest-100 pb-4">
            {t.orderSummary}
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-forest-700">
              <span>{t.subtotal}</span>
              <span className="font-bold text-forest-950">{formatPrice(subtotal, language)}</span>
            </div>
            <div className="flex justify-between text-forest-700">
              <span>{t.deliveryCharge}</span>
              <span className="text-xs text-forest-500 font-medium">
                {language === 'bn' ? 'চেকআউটে জেলা অনুযায়ী' : 'Calculated at checkout'}
              </span>
            </div>
            <div className="pt-3 border-t border-forest-100 flex justify-between items-baseline">
              <span className="font-bold text-base text-forest-950">{t.grandTotal}</span>
              <span className="font-extrabold text-2xl text-forest-950 font-serif">
                {formatPrice(subtotal, language)}*
              </span>
            </div>
            <p className="text-[11px] text-forest-500">
              *{language === 'bn' ? 'ডেলিভারি চার্জ ব্যতীত' : 'Excluding delivery charge'}
            </p>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-forest-900 hover:bg-forest-800 text-ivory rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <span>{t.checkout}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="p-4 bg-forest-50 rounded-2xl space-y-2 text-xs text-forest-800">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-leaf" />
              <span>{language === 'bn' ? 'নিরাপদ চেকআউট' : 'Secure Checkout'}</span>
            </div>
            <p className="text-forest-600 text-[11px] leading-relaxed">
              {language === 'bn'
                ? 'গেস্ট বা একাউন্টের মাধ্যমে যেকোনো জেলা থেকে সহজেই অর্ডার করতে পারবেন।'
                : 'Supports both guest orders and registered customer checkout.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
