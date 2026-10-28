'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/context';
import { formatPrice, formatDate } from '../../../lib/utils/formatters';
import { initialOrders } from '../../../lib/mock-data';
import { Order, FulfillmentStatusType } from '../../../types/database';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, Truck, Package } from 'lucide-react';

export default function AdminOrdersPage() {
  const { language, t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;
      setOrders(allOrders);
    } catch {
      setOrders(initialOrders);
    }
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.order_reference.toLowerCase().includes(q) ||
      o.contact_phone.includes(q) ||
      o.customer_name.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.fulfillment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: FulfillmentStatusType) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            fulfillment_status: newStatus,
            stock_restored: newStatus === 'cancelled' ? true : ord.stock_restored,
            cancelled_at: newStatus === 'cancelled' ? new Date().toISOString() : ord.cancelled_at,
          };
        }
        return ord;
      });

      try {
        localStorage.setItem('noninature_orders', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'অর্ডার পাইপলাইন' : 'Order Pipeline'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'গ্রাহকদের অর্ডার নিশ্চিতকরণ, প্যাকেজিং, শিপিং ও পেমেন্ট যাচাই'
              : 'Fulfill customer orders, track payments, and update shipping lifecycle'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'রেফারেন্স, মোবাইল বা গ্রাহকের নাম দিয়ে খুঁজুন...' : 'Search by reference, phone, or customer name...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-leaf"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-leaf"
          >
            <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="p-4 pl-6">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">District</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {language === 'bn' ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'No orders matching filter'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                      {ord.order_reference}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatDate(ord.created_at, language)}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{ord.customer_name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{ord.contact_phone}</p>
                    </td>
                    <td className="p-4">{ord.delivery_district}</td>
                    <td className="p-4 font-bold text-slate-900 font-serif">
                      {formatPrice(ord.grand_total, language)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.payment_status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.payment_method.toUpperCase()} • {ord.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.fulfillment_status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as FulfillmentStatusType)
                        }
                        className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-leaf"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg inline-block transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
