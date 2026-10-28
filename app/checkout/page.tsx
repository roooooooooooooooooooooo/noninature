'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/cart/context';
import { useI18n } from '../../lib/i18n/context';
import { useAuth } from '../../lib/auth/context';
import { formatPrice } from '../../lib/utils/formatters';
import { isValidBangladeshPhone, isValidName, isValidAddress } from '../../lib/utils/validation';
import { mockDeliveryRules, mockSiteSettings, initialOrders } from '../../lib/mock-data';
import { DeliveryRule, PaymentMethodType, Order } from '../../types/database';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { t, language } = useI18n();
  const { user } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState('Inside Dhaka');
  const [cityArea, setCityArea] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill if user logged in
  useEffect(() => {
    if (user) {
      if (user.full_name && !fullName) setFullName(user.full_name);
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  // Delivery fee calculation
  const matchedRule = mockDeliveryRules.find(
    (r) => r.district_name_en === district || (district !== 'Inside Dhaka' && r.is_default)
  );

  const baseDeliveryFee = matchedRule ? matchedRule.delivery_fee : 130;
  const freeThreshold = mockSiteSettings.general_settings.free_shipping_threshold;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : baseDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      router.push('/shop');
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};
    if (!isValidName(fullName)) {
      newErrors.fullName =
        language === 'bn' ? 'অনুগ্রহ করে আপনার সঠিক নাম লিখুন।' : 'Please enter your full name.';
    }
    if (!isValidBangladeshPhone(phone)) {
      newErrors.phone =
        language === 'bn'
          ? '১১ ডিজিটের সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01711223344)।'
          : 'Please enter a valid 11-digit Bangladesh phone number (e.g. 01711223344).';
    }
    if (!isValidAddress(address)) {
      newErrors.address =
        language === 'bn'
          ? 'অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।'
          : 'Please enter your full delivery address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Generate unique order reference: NN-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const orderReference = `NN-${dateStr}-${randomHex}`;

    // Create Order Record
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_reference: orderReference,
      user_id: user?.id || null,
      customer_name: fullName.trim(),
      contact_phone: phone.trim(),
      delivery_district: district,
      delivery_address: `${address.trim()}${cityArea ? ', ' + cityArea.trim() : ''}`,
      delivery_notes: deliveryNotes.trim() || null,
      payment_method: paymentMethod,
      payment_status: 'pending',
      fulfillment_status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      discount_total: 0,
      grand_total: grandTotal,
      items: items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        order_id: `ord-${Date.now()}`,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: language === 'bn' ? item.name_bn : item.name_en,
        variant_name: item.variant_name_en || null,
        sku: item.sku,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
        image_url: item.image_url,
        created_at: new Date().toISOString(),
      })),
      payments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to local storage for track-order and admin review fallback
    try {
      const existingOrdersStr = localStorage.getItem('noninature_orders');
      const existingOrders: Order[] = existingOrdersStr
        ? JSON.parse(existingOrdersStr)
        : initialOrders;
      existingOrders.unshift(newOrder);
      localStorage.setItem('noninature_orders', JSON.stringify(existingOrders));
    } catch {
      // Ignore
    }

    // Clear cart & redirect
    clearCart();
    router.push(`/order-confirmation/${orderReference}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-forest-950">{t.cartEmpty}</h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-semibold"
        >
          <span>{t.continueShopping}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif text-forest-950">{t.checkout}</h1>
        <p className="text-xs sm:text-sm text-botanicalDark/70 mt-1">
          {user
            ? language === 'bn'
              ? `স্বাগতম, ${user.full_name}! আপনার সংরক্ষিত তথ্য নিচে পূরণ করা হয়েছে।`
              : `Welcome back, ${user.full_name}! Your details have been prefilled.`
            : t.guestCheckout}
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Delivery Section */}
          <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold font-serif text-forest-950 flex items-center gap-2 border-b border-forest-100 pb-3">
              <Truck className="w-5 h-5 text-leaf" />
              <span>{t.deliveryInfo}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: কাজী তানভীর হাসান' : 'e.g. Kazi Tanvir Hasan'}
                  className={`w-full bg-forest-50/50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                    errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-forest-200 focus:ring-2 focus:ring-leaf'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {t.phoneNumber} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className={`w-full bg-forest-50/50 border rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all ${
                    errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-forest-200 focus:ring-2 focus:ring-leaf'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {t.district} *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-leaf"
                >
                  <option value="Inside Dhaka">Inside Dhaka (ঢাকার ভেতরে) - ৳70</option>
                  <option value="Chattogram">Chattogram (চট্টগ্রাম) - ৳120</option>
                  <option value="Sylhet">Sylhet (সিলেট) - ৳120</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী) - ৳120</option>
                  <option value="Khulna">Khulna (খুলনা) - ৳120</option>
                  <option value="Barishal">Barishal (বরিশাল) - ৳120</option>
                  <option value="Rangpur">Rangpur (রংপুর) - ৳130</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ) - ৳110</option>
                  <option value="Outside Dhaka (Other Districts)">
                    All Other Districts (অন্যান্য জেলা) - ৳130
                  </option>
                </select>
              </div>

              {/* City / Area / Upazila */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {language === 'bn' ? 'থানা / উপজেলা / এলাকা' : 'Upazila / Area'}
                </label>
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: উত্তরা / মিরপুর / সদর' : 'e.g. Uttara / Sadar'}
                  className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {t.deliveryAddress} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'bn' ? 'বাসা/ফ্ল্যাট নং, রোড নং, এলাকার নাম...' : 'House/Flat #, Road #, Village/Area...'}
                  className={`w-full bg-forest-50/50 border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                    errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-forest-200 focus:ring-2 focus:ring-leaf'
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
              </div>

              {/* Notes */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                  {t.deliveryNotes}
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: দুপুরে ডেলিভারি দিলে ভালো হয়' : 'e.g. Deliver during daytime'}
                  className="w-full bg-forest-50/50 border border-forest-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-5 shadow-sm">
            <h2 className="text-lg font-bold font-serif text-forest-950 flex items-center gap-2 border-b border-forest-100 pb-3">
              <CreditCard className="w-5 h-5 text-leaf" />
              <span>{t.paymentMethod}</span>
            </h2>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                    : 'border-forest-200 hover:border-forest-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-leaf w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest-950 block">{t.cod}</span>
                    <span className="text-xs text-botanicalDark/70">
                      {language === 'bn'
                        ? 'পণ্য হাতে পেয়ে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।'
                        : 'Pay cash to delivery person upon receiving your parcel.'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-forest-100 text-forest-900 rounded-full">
                  COD
                </span>
              </label>

              {/* bKash */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                    : 'border-forest-200 hover:border-forest-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="accent-leaf w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest-950 block">{t.bkash}</span>
                    <span className="text-xs text-botanicalDark/70">
                      {language === 'bn'
                        ? 'বিকাশ পার্সোনাল নম্বরে Send Money করে TrxID প্রদান করুন।'
                        : 'Send Money to our bKash personal number & provide TrxID.'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full">
                  bKash
                </span>
              </label>

              {/* Nagad */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                    : 'border-forest-200 hover:border-forest-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="accent-leaf w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest-950 block">{t.nagad}</span>
                    <span className="text-xs text-botanicalDark/70">
                      {language === 'bn'
                        ? 'নগদ পার্সোনাল নম্বরে Send Money করে TrxID প্রদান করুন।'
                        : 'Send Money to our Nagad personal number & provide TrxID.'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Nagad
                </span>
              </label>

              {/* Rocket */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'rocket'
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                    : 'border-forest-200 hover:border-forest-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="rocket"
                    checked={paymentMethod === 'rocket'}
                    onChange={() => setPaymentMethod('rocket')}
                    className="accent-leaf w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest-950 block">{t.rocket}</span>
                    <span className="text-xs text-botanicalDark/70">
                      {language === 'bn'
                        ? 'রকেট নম্বরে Send Money করে TrxID প্রদান করুন।'
                        : 'Send Money via Rocket mobile banking.'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Rocket
                </span>
              </label>

              {/* Bank */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                    : 'border-forest-200 hover:border-forest-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="accent-leaf w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-sm text-forest-950 block">{t.bank}</span>
                    <span className="text-xs text-botanicalDark/70">
                      {language === 'bn'
                        ? 'সরাসরি ব্যাংক একাউন্টে ট্রান্সফার / ডিপোজিট।'
                        : 'Direct deposit or bank transfer.'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Bank
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold font-serif text-forest-950 border-b border-forest-100 pb-4">
              {t.orderSummary}
            </h2>

            {/* Item Previews */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-forest-50">
              {items.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-forest-50 rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image_url || '/images/logo.png'}
                        alt={item.name_en}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-forest-950 truncate">
                        {language === 'bn' ? item.name_bn : item.name_en}
                      </p>
                      <p className="text-forest-600">
                        {item.quantity} × {formatPrice(item.price, language)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-forest-950 flex-shrink-0 ml-2">
                    {formatPrice(item.price * item.quantity, language)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakup */}
            <div className="space-y-2 pt-4 border-t border-forest-100 text-sm">
              <div className="flex justify-between text-forest-700">
                <span>{t.subtotal}</span>
                <span className="font-bold text-forest-950">{formatPrice(subtotal, language)}</span>
              </div>

              <div className="flex justify-between text-forest-700 items-center">
                <div className="flex items-center gap-1">
                  <span>{t.deliveryCharge}</span>
                  <span className="text-[11px] text-forest-500">({district})</span>
                </div>
                {deliveryFee === 0 ? (
                  <span className="font-bold text-leaf">{language === 'bn' ? 'ফ্রি' : 'FREE'}</span>
                ) : (
                  <span className="font-bold text-forest-950">{formatPrice(deliveryFee, language)}</span>
                )}
              </div>

              <div className="pt-3 border-t border-forest-100 flex justify-between items-baseline">
                <span className="font-bold text-base text-forest-950">{t.grandTotal}</span>
                <span className="font-extrabold text-2xl text-forest-950 font-serif">
                  {formatPrice(grandTotal, language)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-forest-900 hover:bg-forest-800 disabled:bg-forest-700 text-ivory rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Lock className="w-4 h-4 text-gold" />
              <span>{isSubmitting ? t.placingOrder : t.placeOrder}</span>
            </button>

            <p className="text-[11px] text-center text-forest-600">
              {language === 'bn'
                ? 'অর্ডার নিশ্চিত করার পর আপনি ট্র্যাকিং রেফারেন্স নম্বর পাবেন।'
                : 'You will receive your unique tracking reference after placing the order.'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
