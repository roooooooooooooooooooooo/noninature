'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/cart/context';
import { useI18n } from '../../lib/i18n/context';
import { formatPrice } from '../../lib/utils/formatters';
import { mockSiteSettings } from '../../lib/mock-data';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, updateQuantity, removeItem } = useCart();
  const { t, language } = useI18n();

  const freeShippingThreshold = mockSiteSettings.general_settings.free_shipping_threshold;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-forest-100 flex items-center justify-between bg-forest-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-800" />
              <h3 className="font-semibold text-lg text-forest-950 font-serif">
                {t.shoppingCart}
              </h3>
              <span className="text-xs bg-forest-200 text-forest-900 px-2 py-0.5 rounded-full font-bold">
                {items.length}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-forest-700 hover:text-forest-950 hover:bg-forest-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-ivory/80 px-4 py-3 border-b border-ivory-dark text-xs">
            {neededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-forest-800 font-medium">
                  <span>
                    {language === 'bn'
                      ? `আর ${formatPrice(neededForFreeShipping, 'bn')} টাকার পণ্য কিনলে ফ্রি ডেলিভারি!`
                      : `Add ${formatPrice(neededForFreeShipping, 'en')} more to get Free Delivery!`}
                  </span>
                  <span className="text-leaf font-bold">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-forest-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-leaf h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-forest-900 font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>
                  {language === 'bn'
                    ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি সুবিধা অর্জন করেছেন!'
                    : 'Congratulations! You unlocked Free Delivery!'}
                </span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center text-forest-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-forest-900 text-base">{t.cartEmpty}</p>
                  <p className="text-xs text-forest-600 mt-1">
                    {language === 'bn'
                      ? 'আমাদের প্রাকৃতিক নোনি পণ্যগুলো ঘুরে দেখুন।'
                      : 'Explore our catalog of organic noni products.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-5 py-2 rounded-full bg-forest-900 text-ivory text-xs font-semibold hover:bg-forest-800 transition-colors"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-forest-50/40 rounded-xl border border-forest-100/80 items-center transition-all hover:border-forest-200"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-forest-100 flex items-center justify-center p-1">
                    <Image
                      src={item.image_url || '/images/logo.png'}
                      alt={item.name_en}
                      width={60}
                      height={60}
                      className="object-contain max-h-14 w-auto"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-botanicalDark truncate">
                      {language === 'bn' ? item.name_bn : item.name_en}
                    </h4>
                    {item.variant_name_en && (
                      <p className="text-xs text-forest-600 font-medium">
                        {language === 'bn' ? item.variant_name_bn : item.variant_name_en}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-forest-900">
                        {formatPrice(item.price, language)}
                      </span>
                      {item.regular_price > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(item.regular_price, language)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-forest-200 bg-white rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-forest-700 hover:bg-forest-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-botanicalDark">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1 text-forest-700 hover:bg-forest-50 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-forest-500">
                        = {formatPrice(item.price * item.quantity, language)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-forest-100 bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-forest-700">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-forest-950 text-base">
                    {formatPrice(subtotal, language)}
                  </span>
                </div>
                <p className="text-[11px] text-forest-500">
                  {language === 'bn'
                    ? 'ডেলিভারি চার্জ চেকআউটে জেলার ভিত্তিতে যোগ হবে।'
                    : 'Delivery fee calculated at checkout based on district.'}
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>{t.checkout}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2 bg-forest-50 hover:bg-forest-100 text-forest-900 rounded-xl font-medium text-xs flex items-center justify-center transition-colors border border-forest-200/80"
                >
                  {language === 'bn' ? 'সম্পূর্ণ ব্যাগ দেখুন' : 'View Full Cart'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
