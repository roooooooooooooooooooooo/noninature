'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '../../../../lib/i18n/context';
import { formatPrice, formatDate } from '../../../../lib/utils/formatters';
import { initialOrders } from '../../../../lib/mock-data';
import { Order } from '../../../../types/database';
import { ArrowLeft, Package, Truck, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { language, t } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;
      const found = allOrders.find((o) => o.id === id);
      if (found) setOrder(found);
    } catch {
      // Ignore
    }
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'অর্ডারটি পাওয়া যায়নি' : 'Order Not Found'}
        </h2>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest-900 text-ivory rounded-full text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'অর্ডার তালিকায় ফিরুন' : 'Back to Orders'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 border-b border-forest-100 pb-4">
        <Link href="/account/orders" className="p-2 hover:bg-forest-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-forest-800" />
        </Link>
        <div>
          <span className="text-xs text-forest-600 font-mono">
            {formatDate(order.created_at, language)}
          </span>
          <h1 className="text-2xl font-bold font-mono text-forest-950">
            {order.order_reference}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-forest-100 pb-4">
          <span className="text-xs uppercase font-bold text-forest-900 tracking-wider">
            {language === 'bn' ? 'ডেলিভারি স্ট্যাটাস' : 'Fulfillment Status'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-900">
            {order.fulfillment_status}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-forest-900">
            {language === 'bn' ? 'পণ্যসমূহ' : 'Items'}
          </h3>
          <div className="divide-y divide-forest-50 border border-forest-100 rounded-2xl p-4">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-forest-950">{item.product_name}</p>
                  {item.variant_name && <p className="text-forest-600">{item.variant_name}</p>}
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

        <div className="pt-2 border-t border-forest-100 space-y-2 text-xs">
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

        <div className="p-4 bg-forest-50/50 rounded-2xl text-xs space-y-1 text-forest-800">
          <p><strong className="text-forest-950">{t.deliveryAddress}:</strong> {order.delivery_address} ({order.delivery_district})</p>
          <p><strong className="text-forest-950">{t.phoneNumber}:</strong> {order.contact_phone}</p>
          <p><strong className="text-forest-950">{t.paymentMethod}:</strong> {order.payment_method.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
