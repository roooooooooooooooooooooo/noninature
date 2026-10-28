'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '../../../../lib/i18n/context';
import { formatPrice, formatDate } from '../../../../lib/utils/formatters';
import { initialOrders } from '../../../../lib/mock-data';
import { Order, PaymentStatusType, FulfillmentStatusType } from '../../../../types/database';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

export default function AdminOrderDetailPage() {
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

  const updateOrderInStorage = (updated: Order) => {
    setOrder(updated);
    try {
      const storedStr = localStorage.getItem('noninature_orders');
      if (storedStr) {
        const allOrders: Order[] = JSON.parse(storedStr);
        const idx = allOrders.findIndex((o) => o.id === updated.id);
        if (idx > -1) {
          allOrders[idx] = updated;
          localStorage.setItem('noninature_orders', JSON.stringify(allOrders));
        }
      }
    } catch {
      // Ignore
    }
  };

  const handleVerifyPayment = (paymentIndex: number, newStatus: 'verified' | 'rejected') => {
    if (!order) return;
    const updatedPayments = [...(order.payments || [])];
    if (updatedPayments[paymentIndex]) {
      updatedPayments[paymentIndex] = {
        ...updatedPayments[paymentIndex],
        status: newStatus,
        verified_at: new Date().toISOString(),
        verified_by: 'Admin',
      };
    }

    const updatedOrder: Order = {
      ...order,
      payments: updatedPayments,
      payment_status: newStatus === 'verified' ? 'verified' : 'failed',
    };

    updateOrderInStorage(updatedOrder);
  };

  const handleFulfillmentChange = (newStatus: FulfillmentStatusType) => {
    if (!order) return;
    const isCancel = newStatus === 'cancelled';
    const updatedOrder: Order = {
      ...order,
      fulfillment_status: newStatus,
      stock_restored: isCancel ? true : order.stock_restored,
      cancelled_at: isCancel ? new Date().toISOString() : order.cancelled_at,
      cancellation_reason: isCancel ? 'Administrative cancellation & stock restoration' : order.cancellation_reason,
    };
    updateOrderInStorage(updatedOrder);
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-slate-900">Order not found</h2>
        <Link href="/admin/orders" className="text-xs text-leaf font-semibold hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-mono text-slate-900">
              {order.order_reference}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Created on {formatDate(order.created_at, language)}
            </p>
          </div>
        </div>

        {/* Fulfillment Pipeline Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Fulfillment:</span>
          <select
            value={order.fulfillment_status}
            onChange={(e) => handleFulfillmentChange(e.target.value as FulfillmentStatusType)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-leaf"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled (Restore Stock)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer info & Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm text-xs">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">
              Customer & Delivery Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500">Customer Name</p>
                <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-slate-500">Contact Phone</p>
                <p className="font-bold text-slate-900 font-mono">{order.contact_phone}</p>
              </div>
              <div>
                <p className="text-slate-500">Delivery District</p>
                <p className="font-bold text-slate-900">{order.delivery_district}</p>
              </div>
              <div>
                <p className="text-slate-500">Delivery Address</p>
                <p className="font-bold text-slate-900">{order.delivery_address}</p>
              </div>
              {order.delivery_notes && (
                <div className="sm:col-span-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200/60">
                  <p className="font-bold text-amber-900">Delivery Instructions:</p>
                  <p className="text-amber-800">{order.delivery_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-sm text-xs">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">
              Ordered Items Snapshot
            </h2>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.product_name}</p>
                    {item.variant_name && <p className="text-slate-500">{item.variant_name}</p>}
                    <p className="text-slate-400 font-mono text-[11px]">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-serif">
                      {item.quantity} × {formatPrice(item.unit_price, language)} ={' '}
                      {formatPrice(item.line_total, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatPrice(order.subtotal, language)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee:</span>
                <span className="font-bold text-slate-900">{formatPrice(order.delivery_fee, language)}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="font-serif text-base">{formatPrice(order.grand_total, language)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment Verification Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-sm text-xs">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-leaf" />
              <span>Payment Verification</span>
            </h2>

            <div>
              <p className="text-slate-500">Method</p>
              <p className="font-bold text-slate-900 uppercase text-sm">{order.payment_method}</p>
            </div>

            <div>
              <p className="text-slate-500">Payment Status</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.payment_status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.payment_status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.payment_status}
              </span>
            </div>

            {/* Manual Payment Submissions */}
            {order.payment_method !== 'cod' && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-slate-800">Submitted Transactions</h3>
                {order.payments && order.payments.length > 0 ? (
                  order.payments.map((pay, pIdx) => (
                    <div
                      key={pay.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                    >
                      <p>
                        <strong className="text-slate-900">Sender:</strong> {pay.sender_phone}
                      </p>
                      <p>
                        <strong className="text-slate-900">TrxID:</strong>{' '}
                        <span className="font-mono font-bold text-purple-700">
                          {pay.transaction_id}
                        </span>
                      </p>
                      <p>
                        <strong className="text-slate-900">Amount:</strong>{' '}
                        {formatPrice(pay.amount, language)}
                      </p>
                      <p>
                        <strong className="text-slate-900">Status:</strong>{' '}
                        <span className="capitalize font-semibold">{pay.status}</span>
                      </p>

                      {pay.status === 'pending' && (
                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(pIdx, 'verified')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-colors"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(pIdx, 'rejected')}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No transaction submitted by customer yet.</p>
                )}
              </div>
            )}

            {/* Safe Stock Restoration Info */}
            {order.stock_restored && (
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex items-center gap-2 text-red-800 text-[11px] font-semibold">
                <RotateCcw className="w-4 h-4 flex-shrink-0" />
                <span>Stock has been safely restored to inventory for cancelled order.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
