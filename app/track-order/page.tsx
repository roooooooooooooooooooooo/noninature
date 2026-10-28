'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { formatPrice, formatDate } from '../../lib/utils/formatters';
import { initialOrders } from '../../lib/mock-data';
import { Order } from '../../types/database';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const { t, language } = useI18n();

  const [orderRef, setOrderRef] = useState(initialRef);
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setErrorMessage('');
    setMatchedOrder(null);

    const cleanRef = orderRef.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    if (!cleanRef || !cleanPhone) {
      setErrorMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে অর্ডার রেফারেন্স এবং মোবাইল নম্বর উভয়ই লিখুন।'
          : 'Please enter both Order Reference and Phone number.'
      );
      return;
    }

    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;

      const found = allOrders.find((o) => {
        const orderPhoneClean = o.contact_phone.replace(/[^0-9]/g, '');
        const refMatch = o.order_reference.toLowerCase() === cleanRef;
        const phoneMatch =
          orderPhoneClean.endsWith(cleanPhone.slice(-10)) || cleanPhone.endsWith(orderPhoneClean.slice(-10));
        return refMatch && phoneMatch;
      });

      if (found) {
        setMatchedOrder(found);
      } else {
        setErrorMessage(
          language === 'bn'
            ? 'প্রদত্ত অর্ডার রেফারেন্স ও মোবাইল নম্বরের সাথে মিল রেখে কোনো অর্ডার খুঁজে পাওয়া যায়নি।'
            : 'No order found matching this Order Reference and Phone number.'
        );
      }
    } catch {
      setErrorMessage('Error retrieving order data.');
    }
  };

  const steps = [
    { key: 'pending', label_bn: 'অপেক্ষমাণ', label_en: 'Pending' },
    { key: 'confirmed', label_bn: 'নিশ্চিত হয়েছে', label_en: 'Confirmed' },
    { key: 'processing', label_bn: 'প্যাকেজিং চলছে', label_en: 'Processing' },
    { key: 'shipped', label_bn: 'ডেলিভারিতে আছে', label_en: 'Shipped' },
    { key: 'delivered', label_bn: 'ডেলিভারি সম্পন্ন', label_en: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx > -1 ? idx : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-leaf">
          {language === 'bn' ? 'অর্ডার অনুসন্ধান' : 'Live Tracking'}
        </span>
        <h1 className="text-3xl font-bold font-serif text-forest-950">
          {t.trackOrder}
        </h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70 max-w-md mx-auto">
          {t.trackOrderDesc}
        </p>
      </div>

      {/* Track Order Hero Image Banner */}
      <div className="relative h-44 sm:h-56 w-full rounded-3xl overflow-hidden shadow-lg border border-forest-100 group">
        <Image
          src="/images/slides/slide-1.webp"
          alt="Track Order Delivery"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/30 to-transparent flex items-end p-6">
          <div className="text-ivory space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">
              {language === 'bn' ? 'নিরাপদ ডেলিভারি ট্র্যাকিং' : 'Real-time Express Logistics'}
            </span>
            <p className="text-base sm:text-lg font-serif font-bold">
              {language === 'bn' ? 'আপনার অর্ডার নম্বর ও ফোন দিয়ে রিয়েল-টাইম অবস্থান জানুন' : 'Track Package Dispatch Across 64 Districts'}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Challenge Form */}
      <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-forest-900 uppercase">
              {t.orderReference} *
            </label>
            <input
              type="text"
              required
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              placeholder="e.g. NN-20261026-A101"
              className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-forest-900 uppercase">
              {t.phoneNumber} *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:ring-2 focus:ring-leaf"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.checkStatus}</span>
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Order Status Result */}
      {matchedOrder && (
        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-10 space-y-8 shadow-sm animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-4">
            <div>
              <span className="text-xs text-forest-600 font-medium">{t.orderReference}</span>
              <h2 className="text-xl font-bold font-mono text-forest-950">
                {matchedOrder.order_reference}
              </h2>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-forest-600 font-medium">{language === 'bn' ? 'তারিখ' : 'Date'}</span>
              <p className="text-xs font-bold text-forest-950">
                {formatDate(matchedOrder.created_at, language)}
              </p>
            </div>
          </div>

          {/* Lifecycle Stepper */}
          {matchedOrder.fulfillment_status === 'cancelled' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-semibold">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>
                {language === 'bn'
                  ? 'এই অর্ডারটি বাতিল করা হয়েছে।'
                  : 'This order has been cancelled.'}
                {matchedOrder.cancellation_reason && ` (${matchedOrder.cancellation_reason})`}
              </span>
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-5 gap-2 relative">
                {steps.map((s, idx) => {
                  const currentIdx = getStepIndex(matchedOrder.fulfillment_status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={s.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-leaf text-white ring-4 ring-leaf/20 shadow-md'
                            : 'bg-forest-100 text-forest-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold leading-tight ${
                          isCurrent ? 'text-forest-950 font-bold' : isDone ? 'text-leaf' : 'text-forest-400'
                        }`}
                      >
                        {language === 'bn' ? s.label_bn : s.label_en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-forest-100 text-xs">
            <div className="space-y-2 bg-forest-50/50 p-4 rounded-2xl">
              <h4 className="font-bold text-forest-950 uppercase tracking-wide">
                {t.deliveryInfo}
              </h4>
              <p><strong className="text-forest-900">{t.fullName}:</strong> {matchedOrder.customer_name}</p>
              <p><strong className="text-forest-900">{t.phoneNumber}:</strong> {matchedOrder.contact_phone}</p>
              <p><strong className="text-forest-900">{t.district}:</strong> {matchedOrder.delivery_district}</p>
              <p><strong className="text-forest-900">{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {matchedOrder.delivery_address}</p>
            </div>

            <div className="space-y-2 bg-forest-50/50 p-4 rounded-2xl">
              <h4 className="font-bold text-forest-950 uppercase tracking-wide">
                {language === 'bn' ? 'পেমেন্ট ও আর্থিক বিবরণ' : 'Payment & Summary'}
              </h4>
              <p><strong className="text-forest-900">{t.paymentMethod}:</strong> {matchedOrder.payment_method.toUpperCase()}</p>
              <p>
                <strong className="text-forest-900">{language === 'bn' ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment Status:'}</strong>{' '}
                <span className={`px-2 py-0.5 rounded-full font-bold ${
                  matchedOrder.payment_status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {matchedOrder.payment_status === 'verified' ? t.paymentVerified : t.paymentPending}
                </span>
              </p>
              <p><strong className="text-forest-900">{t.subtotal}:</strong> {formatPrice(matchedOrder.subtotal, language)}</p>
              <p><strong className="text-forest-900">{t.deliveryCharge}:</strong> {formatPrice(matchedOrder.delivery_fee, language)}</p>
              <p className="pt-1 border-t border-forest-200 font-bold text-sm text-forest-950">
                {t.grandTotal}: {formatPrice(matchedOrder.grand_total, language)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs text-forest-950 uppercase tracking-wide">
              {language === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ' : 'Ordered Items'}
            </h4>
            <div className="divide-y divide-forest-100 border border-forest-100 rounded-2xl p-4">
              {matchedOrder.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-forest-950">{item.product_name}</span>
                    {item.variant_name && <span className="text-forest-600 ml-2">({item.variant_name})</span>}
                    <p className="text-forest-500 font-mono">
                      {item.quantity} × {formatPrice(item.unit_price, language)}
                    </p>
                  </div>
                  <span className="font-bold text-forest-950">
                    {formatPrice(item.line_total, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-forest-700">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
