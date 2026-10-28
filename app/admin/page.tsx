'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n/context';
import { formatPrice, formatDate } from '../../lib/utils/formatters';
import { initialOrders, mockProducts } from '../../lib/mock-data';
import { Order, Product } from '../../types/database';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  CircleDollarSign,
  AlertTriangle,
  ArrowRight,
  Eye,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
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

  // Compute metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.fulfillment_status === 'pending').length;
  const confirmedOrdersCount = orders.filter((o) => o.fulfillment_status === 'confirmed').length;

  // Realized revenue (orders verified or delivered)
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'verified' || o.fulfillment_status === 'delivered')
    .reduce((sum, o) => sum + o.grand_total, 0);

  // Low stock products
  const lowStockProducts = mockProducts.filter(
    (p) => p.stock_quantity <= p.low_stock_threshold
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'এডমিন ওভারভিউ' : 'Admin Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'NoniNature এর বিক্রয়, স্টক এবং সাম্প্রতিক অর্ডারসমূহ'
              : 'Store analytics, real-time orders, and inventory health'}
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-forest-900 text-ivory rounded-xl text-xs font-semibold hover:bg-forest-800 transition-colors self-start sm:self-auto"
        >
          <span>{language === 'bn' ? 'সকল অর্ডার পরিচালনা' : 'Manage Orders'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
            </span>
            <div className="p-2 bg-forest-50 text-forest-800 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-slate-900">{totalOrdersCount}</span>
            <span className="text-xs text-slate-500 font-medium">{language === 'bn' ? 'টি' : 'orders'}</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {language === 'bn' ? 'অপেক্ষমাণ অর্ডার' : 'Pending Orders'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-amber-700">{pendingOrdersCount}</span>
            <span className="text-xs text-amber-600 font-medium">
              {language === 'bn' ? 'যাচাই প্রয়োজন' : 'Requires Action'}
            </span>
          </div>
        </div>

        {/* Confirmed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {language === 'bn' ? 'নিশ্চিত অর্ডার' : 'Confirmed Orders'}
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-blue-700">{confirmedOrdersCount}</span>
            <span className="text-xs text-slate-500 font-medium">{language === 'bn' ? 'প্যাকেজিং ও ডেলিভারি' : 'Ready'}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {language === 'bn' ? 'ভেরিফাইড রেভিনিউ' : 'Verified Revenue'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-emerald-800">
              {formatPrice(totalRevenue, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 font-serif">
              {language === 'bn' ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Orders'}
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-leaf hover:underline"
            >
              {language === 'bn' ? 'সকল দেখুন' : 'View all'}
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center">
                {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No recent orders.'}
              </p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        {ord.order_reference}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.fulfillment_status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : ord.fulfillment_status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.fulfillment_status}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      {ord.customer_name} • {ord.contact_phone} • {ord.delivery_district}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 font-serif">
                      {formatPrice(ord.grand_total, language)}
                    </span>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-700 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900">
              {language === 'bn' ? 'সীমিত স্টক সতর্কতা' : 'Low Stock Alerts'}
            </h2>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                {language === 'bn' ? 'সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।' : 'Stock levels healthy.'}
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-1 text-xs"
                >
                  <p className="font-bold text-slate-900 truncate">
                    {language === 'bn' ? p.name_bn : p.name_en}
                  </p>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-mono text-[11px]">{p.sku}</span>
                    <span className="font-bold text-amber-800">
                      {p.stock_quantity} {language === 'bn' ? 'টি অবশিষ্ট' : 'remaining'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/inventory"
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors border border-slate-200 block text-center"
          >
            {language === 'bn' ? 'স্টক সমন্বয় করুন' : 'Manage Stock in Inventory'}
          </Link>
        </div>
      </div>
    </div>
  );
}
