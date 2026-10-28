'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/context';
import { formatPrice, formatDate } from '../../../lib/utils/formatters';
import { mockSiteSettings, initialOrders } from '../../../lib/mock-data';
import { Order, PaymentRecord } from '../../../types/database';
import {
  CheckCircle2,
  Copy,
  Printer,
  ArrowRight,
  CreditCard,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderRef = params.orderReference as string;
  const { language, t } = useI18n();

  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  // Manual payment submission states
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const paymentConfig = mockSiteSettings.payment_settings;

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;
      const found = allOrders.find(
        (o) => o.order_reference.toLowerCase() === orderRef.toLowerCase()
      );
      if (found) {
        setOrder(found);
        if (found.payments && found.payments.length > 0) {
          setIsPaymentSubmitted(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [orderRef]);

  const copyReference = () => {
    navigator.clipboard.writeText(orderRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim() || !trxId.trim()) {
      setSubmissionError(
        language === 'bn' ? 'সেন্ডার নম্বর ও ট্রানজেকশন আইডি উভয়ই প্রয়োজন।' : 'Both Sender phone and TrxID are required.'
      );
      return;
    }

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      order_id: order?.id || 'ord-unknown',
      payment_method: order?.payment_method || 'bkash',
      amount: order?.grand_total || 0,
      sender_phone: senderPhone.trim(),
      transaction_id: trxId.trim().toUpperCase(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Update in local storage
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      if (storedStr) {
        const allOrders: Order[] = JSON.parse(storedStr);
        const idx = allOrders.findIndex(
          (o) => o.order_reference.toLowerCase() === orderRef.toLowerCase()
        );
        if (idx > -1) {
          if (!allOrders[idx].payments) allOrders[idx].payments = [];
          allOrders[idx].payments.push(newPayment);
          allOrders[idx].payment_status = 'pending'; // awaiting verification
          localStorage.setItem('noninature_orders', JSON.stringify(allOrders));
          setOrder(allOrders[idx]);
        }
      }
    } catch {
      // Ignore
    }

    setIsPaymentSubmitted(true);
    setSubmissionError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Banner */}
      <div className="text-center space-y-4 bg-white rounded-3xl border border-forest-100 p-8 sm:p-12 shadow-sm">
        <div className="w-16 h-16 bg-leaf/15 text-leaf rounded-full mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
          {t.orderSuccess}
        </h1>

        <p className="text-xs sm:text-sm text-botanicalDark/70 max-w-md mx-auto leading-relaxed">
          {language === 'bn'
            ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের কাস্টমার কেয়ার টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।'
            : 'Your order has been recorded. Our team will verify and prepare your botanical parcel shortly.'}
        </p>

        {/* Reference Pill */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-forest-50 border border-forest-200 rounded-2xl">
          <span className="text-xs text-forest-700 font-medium">{t.orderReference}:</span>
          <span className="font-mono font-bold text-forest-950 text-sm tracking-wide">
            {orderRef}
          </span>
          <button
            type="button"
            onClick={copyReference}
            className="p-1 hover:bg-forest-100 rounded-md text-forest-700 transition-colors"
            title="Copy"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        {copied && (
          <p className="text-xs text-leaf font-semibold">
            {language === 'bn' ? 'কপি করা হয়েছে!' : 'Copied to clipboard!'}
          </p>
        )}
      </div>

      {/* Manual Payment Submission Form (If bKash, Nagad, Rocket, or Bank) */}
      {order && order.payment_method !== 'cod' && (
        <div className="bg-white rounded-3xl border border-gold/40 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-forest-100 pb-4">
            <CreditCard className="w-6 h-6 text-gold flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold font-serif text-forest-950">
                {t.paymentInstructions} ({order.payment_method.toUpperCase()})
              </h2>
              <p className="text-xs text-forest-600">
                {language === 'bn'
                  ? 'আপনার অর্ডারটি কনফার্ম করতে নিচের নির্দেশিকা অনুসরণ করুন'
                  : 'Follow the steps below to complete payment'}
              </p>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="p-4 bg-forest-50/70 rounded-2xl border border-forest-200/80 space-y-2 text-xs text-forest-900">
            <div className="flex justify-between items-center">
              <span className="font-bold">
                {order.payment_method === 'bkash' && 'bKash Personal (Send Money)'}
                {order.payment_method === 'nagad' && 'Nagad Personal (Send Money)'}
                {order.payment_method === 'rocket' && 'Rocket Personal (Send Money)'}
                {order.payment_method === 'bank' && 'City Bank PLC Account'}
              </span>
              <span className="font-bold text-forest-950 text-sm">
                {order.payment_method === 'bkash' && paymentConfig.bkash_number}
                {order.payment_method === 'nagad' && paymentConfig.nagad_number}
                {order.payment_method === 'rocket' && paymentConfig.rocket_number}
                {order.payment_method === 'bank' && paymentConfig.bank_account_number}
              </span>
            </div>

            <p className="text-botanicalDark/70 leading-relaxed pt-1">
              {order.payment_method === 'bkash' &&
                (language === 'bn' ? paymentConfig.bkash_instructions_bn : paymentConfig.bkash_instructions_en)}
              {order.payment_method === 'nagad' &&
                (language === 'bn' ? paymentConfig.nagad_instructions_bn : paymentConfig.nagad_instructions_en)}
              {order.payment_method === 'rocket' &&
                (language === 'bn' ? paymentConfig.rocket_instructions_bn : paymentConfig.rocket_instructions_en)}
              {order.payment_method === 'bank' &&
                (language === 'bn' ? paymentConfig.bank_instructions_bn : paymentConfig.bank_instructions_en)}
            </p>

            <div className="pt-2 flex justify-between font-bold text-sm border-t border-forest-200">
              <span>{language === 'bn' ? 'প্রদেয় সর্বমোট টাকা:' : 'Total Payable Amount:'}</span>
              <span className="text-forest-950 font-serif text-base">
                {formatPrice(order.grand_total, language)}
              </span>
            </div>
          </div>

          {/* Payment Submission Form */}
          {isPaymentSubmitted ? (
            <div className="p-4 bg-leaf/10 border border-leaf/30 rounded-2xl flex items-center gap-3 text-leaf-dark text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>{t.paymentSubmitted}</span>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-forest-950">
                {language === 'bn' ? 'পেমেন্ট শেষে তথ্য প্রদান করুন' : 'Submit Transaction Information'}
              </h3>

              {submissionError && <p className="text-xs text-red-600 font-medium">{submissionError}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase">
                    {t.senderNumber} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-forest-900 uppercase">
                    {t.trxId} *
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9X7A1289"
                    className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2 text-xs font-mono uppercase outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitPayment}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Order Item Snapshot & Delivery Summary */}
      {order && (
        <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-forest-100 pb-4">
            <h2 className="text-lg font-bold font-serif text-forest-950">
              {t.orderSummary}
            </h2>
            <span className="text-xs text-forest-600 font-mono">
              {formatDate(order.created_at, language)}
            </span>
          </div>

          <div className="divide-y divide-forest-50">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-forest-950">{item.product_name}</p>
                  {item.variant_name && <p className="text-forest-600">{item.variant_name}</p>}
                  <p className="text-forest-400 font-mono">
                    {item.quantity} × {formatPrice(item.unit_price, language)}
                  </p>
                </div>
                <span className="font-bold text-forest-950">
                  {formatPrice(item.line_total, language)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-forest-100 space-y-2 text-xs">
            <div className="flex justify-between text-forest-700">
              <span>{t.subtotal}</span>
              <span className="font-bold text-forest-950">{formatPrice(order.subtotal, language)}</span>
            </div>
            <div className="flex justify-between text-forest-700">
              <span>{t.deliveryCharge}</span>
              <span className="font-bold text-forest-950">{formatPrice(order.delivery_fee, language)}</span>
            </div>
            <div className="pt-2 border-t border-forest-100 flex justify-between font-bold text-sm text-forest-950">
              <span>{t.grandTotal}</span>
              <span className="font-serif text-base">{formatPrice(order.grand_total, language)}</span>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="p-4 bg-forest-50/50 rounded-2xl text-xs space-y-1.5 text-forest-800">
            <p>
              <strong className="text-forest-950">{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer:'}</strong> {order.customer_name}
            </p>
            <p>
              <strong className="text-forest-950">{language === 'bn' ? 'ফোন:' : 'Phone:'}</strong> {order.contact_phone}
            </p>
            <p>
              <strong className="text-forest-950">{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {order.delivery_address} ({order.delivery_district})
            </p>
            <p>
              <strong className="text-forest-950">{language === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment:'}</strong> {order.payment_method.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          href={`/track-order?ref=${orderRef}`}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-forest-900 text-ivory text-xs font-bold hover:bg-forest-800 transition-all flex items-center justify-center gap-2"
        >
          <span>{t.trackOrder}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border border-forest-200 text-forest-900 text-xs font-semibold hover:bg-forest-50 transition-all text-center"
        >
          {t.continueShopping}
        </Link>
      </div>
    </div>
  );
}
