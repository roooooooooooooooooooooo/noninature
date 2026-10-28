'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../../lib/i18n/context';
import { formatPrice } from '../../../lib/utils/formatters';
import { initialOrders } from '../../../lib/mock-data';
import { Order } from '../../../types/database';
import { Users, Search, Phone, Mail, ShoppingBag } from 'lucide-react';

interface CustomerSummary {
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const { language } = useI18n();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      const allOrders: Order[] = storedStr ? JSON.parse(storedStr) : initialOrders;

      const map = new Map<string, CustomerSummary>();

      allOrders.forEach((o) => {
        const key = o.contact_phone.trim();
        if (map.has(key)) {
          const existing = map.get(key)!;
          existing.ordersCount += 1;
          existing.totalSpent += o.grand_total;
        } else {
          map.set(key, {
            name: o.customer_name,
            phone: o.contact_phone,
            ordersCount: 1,
            totalSpent: o.grand_total,
            lastOrderDate: o.created_at,
          });
        }
      });

      setCustomers(Array.from(map.values()));
    } catch {
      // Ignore
    }
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'গ্রাহক ব্যবস্থাপনা' : 'Customer Directory'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'অর্ডারকারী গ্রাহকদের তালিকা ও মোট ক্রয়ের পরিসংখ্যান'
            : 'Customer contacts and order statistics aggregated from verified orders'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'bn' ? 'গ্রাহকের নাম বা ফোন নম্বর দিয়ে খুঁজুন...' : 'Search by customer name or phone...'}
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="p-4 pl-6">Customer</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4 pr-6 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.map((c) => (
              <tr key={c.phone} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 pl-6">
                  <p className="font-bold text-slate-900">{c.name}</p>
                </td>
                <td className="p-4 font-mono">{c.phone}</td>
                <td className="p-4 font-bold text-slate-900">{c.ordersCount}</td>
                <td className="p-4 pr-6 text-right font-bold text-slate-900 font-serif">
                  {formatPrice(c.totalSpent, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
