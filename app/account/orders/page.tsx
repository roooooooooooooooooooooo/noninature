'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth/context';
import { useI18n } from '../../../lib/i18n/context';
import { formatPrice, formatDate } from '../../../lib/utils/formatters';
import { initialOrders } from '../../../lib/mock-data';
import { Order } from '../../../types/database';
import { Package, ArrowLeft, ChevronRight, Eye } from 'lucide-react';

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const { language, t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;
      setOrders(allOrders);
    } catch {
      setOrders(initialOrders);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center gap-3 border-b border-forest-100 pb-4">
        <Link href="/account" className="p-2 hover:bg-forest-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-forest-800" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'অর্ডার হিস্টোরি' : 'Order History'}
          </h1>
          <p className="text-xs text-botanicalDark/70">
            {language === 'bn' ? `মোট ${orders.length} টি অর্ডার` : `${orders.length} total orders`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-forest-100 p-12 text-center space-y-4">
            <Package className="w-10 h-10 text-forest-300 mx-auto" />
            <p className="text-sm text-botanicalDark/70">
              {language === 'bn' ? 'কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি।' : 'No orders found.'}
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-forest-900 text-ivory rounded-full text-xs font-semibold"
            >
              {t.continueShopping}
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-forest-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-forest-950">
                    {order.order_reference}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.fulfillment_status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.fulfillment_status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-forest-100 text-forest-800'
                    }`}
                  >
                    {order.fulfillment_status}
                  </span>
                </div>
                <p className="text-xs text-forest-600 font-mono">
                  {formatDate(order.created_at, language)} • {order.items?.length || 0} {language === 'bn' ? 'টি আইটেম' : 'items'}
                </p>
                <p className="text-xs text-botanicalDark/80">
                  {order.delivery_district} • {order.payment_method.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-forest-500 uppercase block font-semibold">
                    {t.grandTotal}
                  </span>
                  <span className="text-base font-bold text-forest-950 font-serif">
                    {formatPrice(order.grand_total, language)}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-forest-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
