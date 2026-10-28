'use client';

import React, { useState } from 'react';
import { useI18n } from '../../../lib/i18n/context';
import { formatDate } from '../../../lib/utils/formatters';
import { mockProducts } from '../../../lib/mock-data';
import { Product, InventoryMovement } from '../../../types/database';
import { Boxes, Plus, Minus, ArrowUpDown, History, Check, X } from 'lucide-react';

export default function AdminInventoryPage() {
  const { language } = useI18n();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<InventoryMovement[]>([
    {
      id: 'mov-1',
      product_id: 'prod-juice-01',
      variant_id: null,
      change_quantity: 100,
      previous_stock: 0,
      new_stock: 100,
      movement_type: 'purchase',
      reason: 'Harvest batch arrival from organic farm',
      created_by: 'Admin',
      created_at: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    },
    {
      id: 'mov-2',
      product_id: 'prod-juice-01',
      variant_id: 'var-juice-500ml',
      change_quantity: -2,
      previous_stock: 62,
      new_stock: 60,
      movement_type: 'sale',
      reason: 'Order: NN-20261026-A101',
      created_by: 'System',
      created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'increase' | 'decrease'>('increase');
  const [adjustReason, setAdjustReason] = useState<string>('Restock from agro orchard');

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const delta = adjustType === 'increase' ? adjustAmount : -adjustAmount;
    const prevStock = selectedProduct.stock_quantity;
    const newStock = Math.max(0, prevStock + delta);
    const actualChange = newStock - prevStock;

    // Update product stock
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, stock_quantity: newStock } : p))
    );

    // Record movement audit
    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      product_id: selectedProduct.id,
      variant_id: null,
      change_quantity: actualChange,
      previous_stock: prevStock,
      new_stock: newStock,
      movement_type: adjustType === 'increase' ? 'purchase' : 'adjustment',
      reason: adjustReason.trim() || 'Manual stock update',
      created_by: 'Admin',
      created_at: new Date().toISOString(),
    };

    setMovements((prev) => [newMov, ...prev]);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'স্টক ও ইনভেন্টরি অডিট' : 'Inventory & Stock Audit'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'পণ্যের মজুদ সমন্বয় এবং ইনভেন্টরি মুভমেন্টের সম্পূর্ণ হিস্টোরি'
            : 'Real-time warehouse stock control, manual adjustments, and audit trail'}
        </p>
      </div>

      {/* Current Stock Levels Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-leaf" />
            <span>{language === 'bn' ? 'বর্তমান পণ্যের স্টক' : 'Current Stock Levels'}</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((p) => {
                const isLow = p.stock_quantity <= p.low_stock_threshold;
                const isOut = p.stock_quantity <= 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-900">{p.name_en}</p>
                      <p className="text-[11px] text-slate-400">{p.name_bn}</p>
                    </td>
                    <td className="p-4 font-mono">{p.sku}</td>
                    <td className="p-4 font-bold text-base font-serif text-slate-900">
                      {p.stock_quantity}
                    </td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-1.5 bg-forest-900 hover:bg-forest-800 text-ivory rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      >
                        {language === 'bn' ? 'স্টক পরিবর্তন' : 'Adjust Stock'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movements Audit Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-leaf" />
            <span>{language === 'bn' ? 'ইনভেন্টরি মুভমেন্ট হিস্টোরি' : 'Movement Audit History'}</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {movements.map((m) => (
            <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      m.change_quantity > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {m.movement_type}
                  </span>
                  <span className="font-bold text-slate-900">{m.reason}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {formatDate(m.created_at, language)} • By {m.created_by || 'System'}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`font-bold font-mono text-sm ${
                    m.change_quantity > 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {m.change_quantity > 0 ? `+${m.change_quantity}` : m.change_quantity}
                </span>
                <p className="text-[10px] text-slate-400 font-mono">
                  {m.previous_stock} → {m.new_stock}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold font-serif text-lg text-slate-900">
                  {language === 'bn' ? 'স্টক পরিবর্তন' : 'Adjust Inventory'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{selectedProduct.sku}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Adjustment Direction</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType('increase')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border ${
                      adjustType === 'increase'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stock</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('decrease')}
                    className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 border ${
                      adjustType === 'decrease'
                        ? 'border-red-600 bg-red-50 text-red-800'
                        : 'border-slate-200'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Reduce Stock</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Audit Reason *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. New harvest received from garden"
                  className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest-900 text-ivory rounded-xl font-bold hover:bg-forest-800 transition-colors shadow-md"
                >
                  Record Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
